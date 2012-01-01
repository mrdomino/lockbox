goog.provide('comb');

goog.require('goog.array');


comb.combinations = function(arr, r) {
  if (r == 0 || goog.array.isEmpty(arr)) {
    return [];
  }

  var symbol = arr[0];
  var arr_without_symbol = goog.array.slice(arr, 1);

  if (r == 1) {
    return goog.array.concat([[symbol]], comb.combinations(arr_without_symbol, 1));
  }

  var combs_without_symbol = comb.combinations(arr_without_symbol, r);
  var combs_with_symbol = comb.combinations(arr_without_symbol, r - 1);
  for (var i = 0; i < combs_with_symbol.length; ++i) {
    combs_with_symbol[i] = goog.array.concat([symbol], combs_with_symbol[i]);
  }
  return goog.array.concat(combs_without_symbol, combs_with_symbol);
}
