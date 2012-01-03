goog.provide('rng');


/**
 * Interface to an RNG that allows extracting known quantities of entropy.
 * @interface
 */
rng.Rng = function() {}

/**
 * @param {number} n Number of random bytes to return.
 * @return {Uint8Array} Buffer containing random bytes.
 */
rng.Rng.prototype.getRandomBytes = goog.abstractMethod;

/**
 * Rng using Math.random as entropy source.
 * @constructor
 * @implements rng.Rng
 */
rng.MathRng = function() {}

/**
 * @inheritDoc
 */
rng.MathRng.prototype.getRandomBytes = function(n) {
  var ret = new Uint8Array(n);
  for (var i = 0; i < n; ++i) {
    ret[i] = Math.floor(Math.random() * 256);
  }
  return ret;
}

goog.exportSymbol('rng.MathRng', rng.MathRng);
goog.exportProperty(rng.MathRng.prototype, 'getRandomBytes',
                    rng.MathRng.prototype.getRandomBytes);
