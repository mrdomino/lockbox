goog.provide('ssss');

goog.require('gf28');
goog.require('goog.array');
goog.require('goog.asserts');


/**
 * Uses Shamir's Secret Sharing scheme to split a message into n distinct
 * keys.
 *
 * @param {string|ArrayBuffer|Array.<number>} msg Message to split -- either a
 *     string, an ArrayBuffer, or an array of bytes.
 * @param {number} k Minimum number of keys needed to recombine msg.
 * @param {number=} opt_n Total number of keys to produce (if unspecified,
 *     n=k).
 * @param {ssss.Rng=} opt_rng Entropy source for the algorithm (if
 *     unspecified, use Math.random).
 * @return {Array.<ssss.Key>} n keys of which any k can reconstruct msg, for
 *     which any k - 1 or fewer are indistinguishable from random.
 */
ssss.split = function(msg, k, opt_n, opt_rng) {
  var n = (typeof opt_n == 'undefined') ? k : opt_n;
  var rng = (typeof opt_rng == 'undefined') ? new ssss.MathRng : opt_rng;

  goog.asserts.assert(k >= 2, 'Threshold must be at least 2.');
  goog.asserts.assert(n >= k, 'Must have at least k total keys.');
  goog.asserts.assert(n <= gf28.MASK,
                      "Can't make more than %s distinct keys.", gf28.MASK);

  var m, view;
  if (msg instanceof ArrayBuffer) {
    view = new Uint8Array(msg);
    m = view.length;
  } else {
    m = msg.length;
    view = new Uint8Array(m);
    var ptFn = typeof msg == 'string'
        ? function(i) { return msg.charCodeAt(i); }
        : function(i) { return msg[i]; };
    for (var i = 0; i < m; ++i) {
      var b = ptFn(i);
      goog.asserts.assert(gf28.isElem(b),
                          '%s at msg[%s] is out of range.', b, i);
      view[i] = b;
    }
  }

  var cs = new Uint8Array(k);
  var ret = new Array(n);

  var polyAt = function(x) {
    var sum = gf28.ZERO;
    for (var j = 0; j < cs.length; ++j) {
      var term = gf28.mul(cs[j], gf28.pow(x, j));
      sum = gf28.add(sum, term);
    }
    return sum;
  }

  for (var i = 0; i < n; ++i) {
    ret[i] = new Uint8Array(1 + m);
    ret[i][0] = i + 1;
  }

  for (var i = 0; i < m; ++i) {
    cs.set(rng['getRandomBytes'](k - 1), 1);
    cs[0] = view[i];
    for (var j = 0; j < n; ++j) {
      ret[j][1 + i] = polyAt(j + 1);
    }
  }

  return ret;
}

/**
 * Recombines k or more keys produced by ssss.split back into the original
 * secret message. If fewer than k keys are given, the result will be random.
 * No checksums are embedded; clients are responsible for constructing their
 * own verification mechanism, e.g. signing the message prior to encryption.
 *
 * @param {Array.<ssss.Key>} keys Array of keys to recombine.
 * @return {Uint8Array} The decoded message.
 */
ssss.combine = function(keys) {
  goog.asserts.assert(
    goog.array.every(keys, function(key) {
      return key.length == keys[0].length;
    }));
  if (keys.length == 0) {
    return new Uint8Array(0);
  }
  var m = keys[0].length - 1;
  var ret = new Uint8Array(m);
  var pts = new Array(keys.length);

  for (var i = 0; i < m; ++i) {
    for (var j = 0; j < keys.length; ++j) {
      pts[j] = {'x': keys[j][0], 'y': keys[j][i + 1]};
    }
    ret[i] = ssss.combinePt_(pts);
  }
  return ret;
}

/**
 * @param {Array.<{x: gf28.elem, y: gf28.elem}>} pts Points to combine.
 * @return {gf28.elem} Interpolated polynomial evaluated at x == 0.
 * @private
 */
ssss.combinePt_ = function(pts) {
  // We use LaGrange interpoluation to determine p(x) and evaluate it at 0 to
  // retrieve the original byte.  The LaGrange polynomial over the points
  // ((x_0, y_0), ..., (x_n, y_n)) is
  //   p(x) = y_0 l_0(x) + ... + y_n l_n(x)
  // where
  //   l_i(x) = \product_{j!=i} (x - x_j)/(x_i - x_j).

  var sum = gf28.ZERO;
  var x = gf28.ZERO;

  for (var i = 0; i < pts.length; ++i) {
    var xi = pts[i]['x'];
    var prod = gf28.ONE;
    for (var j = 0; j < pts.length; ++j) {
      if (i == j) continue;
      var xj = pts[j]['x'];
      goog.asserts.assert(xi != xj);
      prod = gf28.mul(prod, gf28.div(gf28.sub(x, xj), gf28.sub(xi, xj)));
    }
    sum = gf28.add(sum, gf28.mul(pts[i]['y'], prod));
  }
  return sum;
}

/**
 * Interface to an RNG that allows extracting known quantities of entropy.
 * @interface
 */
ssss.Rng = function() {}

/**
 * @param {number} n Number of random bytes to return.
 * @return {TypedArray} Buffer containing random bytes.
 */
ssss.Rng.prototype.getRandomBytes = goog.abstractMethod;

/**
 * Rng using Math.random as entropy source.
 * @constructor
 * @implements ssss.Rng
 */
ssss.MathRng = function() {}

/**
 * @inheritDoc
 */
ssss.MathRng.prototype.getRandomBytes = function(n) {
  var ret = new Uint8Array(n);
  for (var i = 0; i < n; ++i) {
    ret[i] = Math.floor(Math.random() * 256);
  }
  return ret;
}

/**
 * @typedef {Uint8Array}
 */
ssss.Key = {};

/**
 * @param {ssss.Key} key
 * @return {gf28.elem} x-coord of points encoded by key
 */
ssss.Key.getX = function(key) {
  var k = new Uint8Array(key);
  return k[0];
}

/**
 * @param {ssss.Key} key
 * @param {number} idx
 * @return {gf28.elem} y-coord of point at idx in key
 */
ssss.Key.getY = function(key, idx) {
  var k = new Uint8Array(key);
  return k[idx + 1];
}

goog.exportSymbol('ssss.MathRng', ssss.MathRng);
goog.exportProperty(ssss.MathRng.prototype, 'getRandomBytes',
                    ssss.MathRng.prototype.getRandomBytes);
goog.exportSymbol('ssss.combine', ssss.combine);
goog.exportSymbol('ssss.split', ssss.split);
goog.exportSymbol('ssss.Key.getX', ssss.Key.getX);
goog.exportSymbol('ssss.Key.getY', ssss.Key.getY);
