/**
 * @fileoverview
 * This file implements Shamir's Secret Sharing Scheme (SSSS) in JavaScript.
 * Given an $m$-byte message $y$, $n$, $k < n$, and $8m(k-1)$ bits of entropy,
 * SSSS encodes $y$ as $n$ different $(8m + \lg n)$--bit keys such that any
 * $k-1$ keys are indistinguishable from random, but any $k$ keys can decode
 * the message.
 *
 * We represent the message as $m$ elements in $GF(2^8)$. For each element
 * $y_j$, we construct a degree $k-1$ polynomial $p_j$ with coefficients in
 * $GF(2^8)$. We choose $k-1$ coefficients at random and pick the last
 * coefficient to be $y_j$. Note that $k$ points are needed to determine $p_j$
 * and therefore $y_j$. The message is then encoded as $(i, (p_1(i), \ldots,
 * p_m(i)))$ for $i$ in $1, \ldots, n$.
 *
 * @author Steven Dee (mrdomino@gmail.com)
 */

/**
 * Shamir's Secret Sharing.
 * @param{Int8Array} msg The message to encode.
 * @param{number} k Minimum decoding threshold (must have k < n).
 * @param{number} n Number of keys to generate.
 * @param{Int8Array} entropy Bits of entropy needed to encode msg (must have
 *     entropy.length == msg.length * (k - 1)).
 * @return{Array.<Int8Array>} List of n encoded keys.
 */
Ssss = function(msg, k, n, entropy) {
  if (n < 1) throw "n must be a postive integer."
  if (k >= n) throw "k must be less than n."
  if (entropy.length != msg.length * (k - 1))
    throw "Need (k - 1) * msg.length bits of entropy."

  var m = msg.length
  var bitsize = (n-1).toString(2).length
  var bytesize = Math.ceil(bitsize / 8)

  var output = new Int8Array(n * m)

  var ret = new Array(n)

  var deg = k - 1

  var processByte = function(b, j) {
    var cs = new Int8Array(deg + 1)
    cs.set(entropy.subarray(deg * j, deg * (j + 1) - 1), 1)
    cs[0] = b
    output.set(firstNValues(cs, n), j * n)
  }

  for (var j = 0; j < m; ++j) {
    processByte(msg[j], j)
  }

  for (var i = 0; i < n; ++i) {
    var key = new Int8Array(bytesize + m)
    for (var l = 0, r = i; r > 0; ++l) {
      key[bytesize - l - 1] = r & 0xff
      r >>= 8
    }
    for (var j = 0; j < m; ++j) {
      key[bytesize + j] = output[j * n + i]
    }
    ret[i] = key
  }
  return ret
}

/**
 * Return the first n values of the polynomial sum_i(cs[i] * x ** i) at x.
 * @param {Int8Array} cs Coefficients of the polynomial.
 * @param {number} x Value to evaluate.
 * @return {Int8Array} First n values of the polynomial (starting at 1).
 */
firstNValues = function(cs, n) {
  var ret = new Int8Array(n)
  var l = cs.length
  for (var i = 0; i < n; ++i) {
    var x = 0;
    for (var j = 0; j < l; ++j) {
      x += cs[j] * Math.pow(i + 1, j)
    }
    ret[i] = x
  }
  return ret
}

gf_2_8_multiply = function(a, b) {
  var p = 0
  while (a != 0 && b != 0) {
    if (b & 1) {
      p ^= a
    }
    var a_l = a & 0x80
    a <<= 1
    if (a_l) {
      a ^= 0x1b
    }
    b >>= 1
  }
  return p
}

var hidden = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
var msg = new Int8Array(hidden.length)
for (var i = 0; i < msg.length; ++i) { msg[i] = hidden.charCodeAt(i) }
var k = 3
var n = 7
var entropy = new Int8Array(msg.length * (k - 1))
for (var i = 0; i < entropy.length; ++i) { entropy[i] = Math.floor(Math.random() * 256) }
var result = Ssss(msg, k, n, entropy)
