goog.provide('comb');

goog.require('goog.array');


comb.combinations = function(arr, r) {
  if (r == 0) {
    return [[]];
  }
  if (goog.array.isEmpty(arr)) {
    return [];
  }

  var symbol = arr[0];
  var arr_without_symbol = goog.array.slice(arr, 1);

  var combs_without_symbol = comb.combinations(arr_without_symbol, r);
  var combs_with_symbol = comb.combinations(arr_without_symbol, r - 1);
  for (var i = 0; i < combs_with_symbol.length; ++i) {
    combs_with_symbol[i] = goog.array.concat([symbol], combs_with_symbol[i]);
  }
  return goog.array.concat(combs_without_symbol, combs_with_symbol);
}

comb.combinationSuchThat = function(pred, arr, r, opt_accum) {
  var accum = (typeof opt_accum == 'undefined') ? [] : opt_accum;
  if (r == 0) {
    return pred(accum) ? accum : undefined;
  }
  if (goog.array.isEmpty(arr)) {
    return undefined;
  }

  var symbol = arr[0];
  var arr_without_symbol = goog.array.slice(arr, 1);

  var candidate = comb.combinationSuchThat(pred, arr_without_symbol, r, accum);
  if (typeof candidate != 'undefined') {
    return candidate;
  }

  return comb.combinationSuchThat(pred, arr_without_symbol, r - 1,
                                  goog.array.concat(accum, [symbol]));
}

goog.exportSymbol("comb.combinations", comb.combinations);
goog.exportSymbol("comb.combinationSuchThat", comb.combinationSuchThat);
