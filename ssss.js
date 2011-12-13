goog.provide('ssss');


ssss.split = function(msg, k, n) {
  if (k <= 1) {
    throw "Threshold must be at least 2";
  }
  if (n < k) {
    throw "Must have at least k total keys";
  }
  if (!n) n = k;
  return {length: n};
}
