goog.provide('ssss');

goog.require('gf28');


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
  if (n > gf28.MASK) {
    throw "Can't make more than " + gf28.MASK + " distinct keys.";
  }
  if (!n) n = k;

  if (msg instanceof ArrayBuffer) {
    var view = new Uint8Array(msg);
    msg = view;
  } else if (typeof msg == 'string') {
    var arr = new Uint8Array(msg.length)
    for (var i = 0; i < msg.length; ++i) {
      arr[i] = msg.charCodeAt(i);
    }
    msg = arr;
  }

  var deg = k - 1;

  var cs = new Uint8Array(deg + 1);
  var ret = new Array(n);
  for (var i = 0; i < n; ++i) {
    ret[i] = new Uint8Array(1 + msg.length);
    ret[i][0] = i + 1;
  }

  for (var i = 0; i < msg.length; ++i) {
    cs.set(opt_rng['getRandomBytes'](deg), 1);
    cs[0] = msg[i];
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
 * Use LaGrange interpolation to recombine k points giving the original secret
 * message.
 * The LaGrange polynomial over the points ((x_0, y_0), ..., (x_n, y_n)) is
 *   p(x) = y_0 l_0(x) + ... + y_n l_n(x)
 * where
 *   l_i(x) = \product_{j!=i} (x - x_j)/(x_i - x_j).
 *
 * @param {Array.<ssss.Key>} keys Array of keys to recombine.
 * @return {Uint8Array} The decoded message.
 */
ssss.combine = function(keys) {
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
 */
ssss.combinePt_ = function(pts, x) {
  var sum = gf28.ZERO;
  var x = gf28.ZERO;

  for (var i = 0; i < pts.length; ++i) {
    var xi = pts[i]['x'];
    var prod = gf28.ONE;
    for (var j = 0; j < pts.length; ++j) {
      if (i == j) continue;
      var xj = pts[j]['x'];
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

goog.exportSymbol('ssss.MathRng', ssss.MathRng);
goog.exportProperty(ssss.MathRng.prototype, 'getRandomBytes',
                    ssss.MathRng.prototype.getRandomBytes);
goog.exportSymbol('ssss.split', ssss.split);
goog.exportSymbol('ssss.getX', ssss.getX);
goog.exportSymbol('ssss.getY', ssss.getY);
