goog.provide('rng');


/**
 * Interface to an RNG that allows extracting known quantities of entropy.
 * @interface
 */
rng.Rng = function() {}

/**
 * @param {ArrayBufferView} view Buffer to which to write random values.
 */
rng.Rng.prototype.getRandomValues = goog.abstractMethod;


/**
 * @return {rng.Rng} Some reasonable Rng (crypto if available; otherwise, a
 * MathRng.)
 */
rng.getRng = function() {
  if (typeof crypto != 'undefined' &&
      typeof crypto['getRandomValues'] == 'function') {
    return crypto;
  }
  // TODO: notify that we're using a potentially weak RNG.
  return new rng.MathRng;
}


/**
 * Rng using Math.random as entropy source.
 * @constructor
 * @implements rng.Rng
 */
rng.MathRng = function() {}

/**
 * @inheritDoc
 */
rng.MathRng.prototype.getRandomValues = function(view) {
  var ret = new Uint8Array(view.buffer);
  var n = ret.length;
  for (var i = 0; i < n; ++i) {
    ret[i] = Math.floor(Math.random() * 256);
  }
}


goog.exportSymbol('rng.getRng', rng.getRng);
goog.exportSymbol('rng.MathRng', rng.MathRng);
goog.exportProperty(rng.MathRng.prototype, 'getRandomValues',
                    rng.MathRng.prototype.getRandomValues);
