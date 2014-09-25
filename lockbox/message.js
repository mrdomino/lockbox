goog.provide('message');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.crypt.Sha1');


/**
 * @typedef {ArrayBuffer}
 */
message.Message;

/**
 * @param {!string} str String to encode.
 * @return {message.Message} Encoded message.
 */
message.encode = function(str) {
  goog.asserts.assert(str != null);
  var bytes = message.stringToBytes_(message.utf8Encode_(str));
  var hash = message.sha1_(bytes);

  var ret = new Uint8Array(1 + bytes.length + hash.length);
  ret[0] = 0x01;
  ret.set(hash, 1);
  ret.set(bytes, 1 + hash.length);
  return ret.buffer;
}

/**
 * @param {message.Message} bytes Encoded message.
 * @return {string} Decoded string.
 */
message.decode = function(bytes) {
  if (!message.verify(bytes)) {
    throw new Error("Invalid message");
  }
  var msg = new Uint8Array(bytes, 21);
  return message.utf8Decode_(message.bytesToString_(msg));
}

/**
 * @param {message.Message} bytes Encoded message.
 * @return {boolean} true iff message has not been altered.
 */
message.verify = function(bytes) {
  var version = new Uint8Array(bytes, 0, 1);
  if (version[0] != 0x01) {
    return false;
  }
  var encoded_hash = new Uint8Array(bytes, 1, 20);
  var computed_hash = message.sha1_(new Uint8Array(bytes, 21));
  return message.buffersMatch_(encoded_hash, computed_hash);
}

/**
 * @param {string} str
 * @return {string}
 * @private
 */
message.utf8Encode_ = function(str) {
  return unescape(encodeURIComponent(str));
}

/**
 * @param {string} str
 * @return {string}
 * @private
 */
message.utf8Decode_ = function(str) {
  return decodeURIComponent(escape(str));
}

/**
 * @param {string} str
 * @return {Uint8Array}
 */
message.stringToBytes_ = function(str) {
  var n = str.length;
  var view = new Uint8Array(n);
  for (var i = 0; i < n; ++i) {
    var c = str.charCodeAt(i);
    goog.asserts.assert((c & 0xff) == c, "%s is not a byte.", c);
    view[i] = str.charCodeAt(i);
  }
  return view;
}

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
message.bytesToString_ = function(buf) {
  var cs = [];
  var n = buf.length;
  for (var i = 0; i < n; ++i) {
    cs.push(String.fromCharCode(buf[i]));
  }
  return cs.join("");
}

/**
 * @param {string|Uint8Array} str
 * @return {Uint8Array} SHA1(str).
 * @private
 */
message.sha1_ = function(str) {
  var sha = new goog.crypt.Sha1;
  sha.update(str);
  var bytes = sha.digest();
  return new Uint8Array(bytes);
}

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @return {boolean} true iff buffers match.
 * @private
 */
message.buffersMatch_ = function(a, b) {
  if (a.length != b.length) {
    return false;
  }
  var n = a.length;
  for (var i = 0; i < n; ++i) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
}
