goog.provide('comb');


comb.combinations = function(arr, r) {
  if (r == 0) {
    return [];
  }
  return [arr];
}
