goog.provide('message');

goog.require('goog.asserts');


/**
 * @param {string} str String to encode.
 * @return {ArrayBuffer} Encoded message.
 */
message.encode = function(str) {
  goog.asserts.assert(str != null);
  var bytes = message.utf8Encode_(str);
  var n = bytes.length;
  var ret = new Uint8Array(n);
  for (var i = 0; i < n; ++i) {
    var c = bytes.charCodeAt(i);
    goog.asserts.assert((c & 0xff) == c, "%s is not a byte.", c);
    ret[i] = c;
  }
  return ret.buffer;
}

/**
 * @param {ArrayBuffer} bytes Encoded message.
 * @return {string} Decoded string.
 */
message.decode = function(bytes) {
  var view = new Uint8Array(bytes);
  var str = "";
  var n = view.length;
  for (var i = 0; i < n; ++i) {
    str += String.fromCharCode(view[i]);
  }
  return message.utf8Decode_(str);
}

message.utf8Encode_ = function(str) {
  return unescape(encodeURIComponent(str));
}

message.utf8Decode_ = function(str) {
  return decodeURIComponent(escape(str));
}
