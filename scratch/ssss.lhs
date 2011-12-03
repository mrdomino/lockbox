\documentclass{article}
\usepackage{microtype}
% vim:tw=80

\newcommand{\SSSS}{\textsc{ssss}}
\newcommand{\GF}[2]{\mathrm{GF}(#1^#2)}

\begin{document}

This file implements Shamir's Secret Sharing Scheme (\SSSS) in Haskell. Given an
$m$-byte message $y$, $n$, $k \le n$, and $8m(k-1)$ bits of entropy, \SSSS\
encodes $y$ as $n$ different $(8m + \lg n)$--bit keys such that any $k - 1$ keys
are indistinguishable from random, but any $k$ keys can decode the message.

We represent $y$ as $m$ elements $y_j \in \GF28$. For each $y_j$, we construct a
degree $k-1$ polynomial
\[ p_j(x) = c_{k-1} x^{k-1} + \cdots + c_1 x + c_0 = \sum_{l=0}^{k-1} c_l x^l \]
with coefficients in $\GF28$. We choose $c_1, \ldots, c_{k-1}$ at random and
pick $c_0 = y_j$. Note that $k$ points $(x, p_j(x))$ are needed to determine
$p_j$ and therefore $y_j$. We pick $n$ such points: $(i,
p_j(i)),i\in\{1,\ldots,n\}$. The full message is then encoded as the $n$ keys
\[\langle i, \langle p_1(i), \ldots, p_m(i)\rangle\rangle, i \in \{1, \ldots,
n\}\mathrm.\]

\end{document}
