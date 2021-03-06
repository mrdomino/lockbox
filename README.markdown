# SSSS Lockbox

This is a distributed lockbox based on [Shamir&rsquo;s Secret
Sharing Scheme][ssss-wiki]. It can be used to split a message like:

    the password is foobar

into keys like:

    Ad5xdKFfyHQAYJRInVPN5DbyK7mDkxYBgkNtzxNBe1k1/6rPc7F1XT5yMys=
    AqLbxUZGWNN/V8HG6aV4kwyglD1W3LC6tuZKILMXbwP8Tyk4cx9AC81CxcA=
    A329qhu6KEWhsfK8xffgvhplCkHuEtLTUYVXjtMlYzW71KOec45TOZxSl5k=
    BFqSupV0ZYCBOWvHAVQPfXgE9yjhQuHR3rEE4+67R7dzMjLLc14qpzYiNAs=
    BYX01ciIFRZf31i9LQaXUG7BaVRZjIO4OdIZTY6JS4E0qbhtc885lWcyZlI=

any k (in this case, 2) of which can be recombined to produce the
original message. You can use this to distribute a secret among
trusted friends, relying on them to only combine keys if some
prearranged condition is met (e.g. you lose your password and need
it, or you die and want to give them access to your information.)

## Building

    git submodule update --init
    make
    surf index.html

## Demo

A demo lives at <https://mrdomino.github.io/lockbox/>.

## TODO

- Rewrite `app.js` and `app.html` to be saner/better-tested.
- Expand functionality to encode longer-form messages with substitution.
- Come up with a reasonable text representation
  for keys and implement formatting/parsing for it.
- Verify that the message encoding scheme H(m) + m is secure against
  corruption and (reasonable) attack, or come up with a better one.
- Provide an option for truly paranoid people to manually enter entropy.
- Make the code work without `TypedArray` (for rhino and older browsers).
- Use GF(2<sup>m</sup>) for larger m to allow more keys.
- Automated testing.
- Add nicer documentation.
- Once it&rsquo;s passed the &ldquo;my mom
  can use it&rdquo; bar, spread it around.

## Thanks

- The Galois Field implementation is based heavily on [James
  Plank&rsquo;s Fast Galois Field Arithmetic Library in C/C++][galois].
- The SSSS API is inspired by [point-at-infinity&rsquo;s ssss][ssss].
- Seeing [Larry Leinweber&rsquo;s GF(2<sup>m</sup>) Elliptic Curve
  Calculator][gfeccalc] got me over the initial &ldquo;waaah, I don&rsquo;t
  want to write a Galois Field library in JavaScript&rdquo; angst.
- [Clipperz][] demonstrated the feasibility of zero-knowledge web-apps
  and client-side JavaScript crypto, and is one of few programs I regularly
  use that passes the &ldquo;I have had drinks with the author&rdquo;
  trust-bar. (Incidentally, I want this to be true for more software I use.)


[clipperz]:         https://www.clipperz.com/                 "Clipperz"
[closure library]:  http://code.google.com/p/closure-library  "Closure Library"
[closure compiler]: http://code.google.com/p/closure-compiler "Closure Compiler"
[galois]:           http://web.eecs.utk.edu/~plank/plank/papers/CS-07-593/
    "Fast Galois Field Arithmetic Library in C/C++"
[gfeccalc]:         http://vorlon.case.edu/~lxl106/gfeccalc.htm
    "GF(2^m) Elliptic Curve Calculator"
[github page]:      http://mrdomino.github.com/lockbox/       "SSSS Lockbox"
[ssss]:             http://point-at-infinity.org/ssss/
    "ssss: Shamir's Secret Sharing Scheme"
[ssss-wiki]:        https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing
    "Shamir's Secret Sharing Scheme"
