goog.provide('ssss');


/**
 * @param {string|ArrayBuffer} msg Message to split.
 * @param {number} k Minimum number of keys needed to recombine msg.
 * @param {number} n Total number of keys to produce.
 * @param {ssss.Rng=} opt_rng Entropy source for the algorithm.
 * @return {Array.<ssss.Key>} n keys of which any k can reconstruct msg, for
 *     which any k - 1 or fewer are indistinguishable from random.
 */
ssss.split = function(msg, k, n, opt_rng) {
  if (typeof opt_rng == 'undefined') {
    opt_rng = new ssss.MathRng;
  }
  if (k <= 1) {
    throw "Threshold must be at least 2";
  }
  if (n < k) {
    throw "Must have at least k total keys";
  }
  if (!n) n = k;

  var deg = k - 1;

  var cs = new Uint8Array(deg + 1);
  var ret = new Array(n);
  for (var i = 0; i < n; ++i) {
    ret[i] = new Uint8Array(1 + msg.length);
    ret[i][0] = i + 1;
  }

  for (var i = 0; i < msg.length; ++i) {
    cs.set(opt_rng.getRandomBytes(deg), 1);
    cs[0] = msg.charCodeAt(i);
    var polyAt = function(x) {
      var sum = gf28.ZERO;
      for (var j = 0; j < cs.length; ++j) {
        var term = gf28.mul(cs[j], gf28.pow(x, j));
        sum = gf28.add(sum, term);
      }
      return sum;
    }
    for (var j = 0; j < n; ++j) {
      ret[j][1 + i] = polyAt(j + 1);
    }
  }

  return ret;
}

/**
 * Interface to an RNG that allows extracting known quantities of entropy.
 * @interface
 */
ssss.Rng = function() {}

/**
 * @param {number} n Number of random bytes to return.
 * @return {ArrayBuffer} Buffer containing random bytes.
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
  var ret = new ArrayBuffer(n);
  var retBytes = new Uint8Array(ret);
  for (var i = 0; i < n; ++i) {
    retBytes[i] = Math.floor(Math.random() * 256);
  }
  return ret;
}

/**
 * @typedef {ArrayBuffer}
 */
ssss.Key;

/**
 * @param {ssss.Key} key
 * @return {gf28.elem} x-coord of points encoded by key
 */
ssss.getX = function(key) {
  var k = new Uint8Array(key);
  return k[0];
}

/**
 * @param {ssss.Key} key
 * @param {number} idx
 * @return {gf28.elem} y-coord of point at idx in key
 */
ssss.getY = function(key, idx) {
  var k = new Uint8Array(key);
  return k[idx + 1];
}
