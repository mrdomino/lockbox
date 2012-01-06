# SSSS Lockbox

This is a distributed lockbox based on [Shamir&rsquo;s Secret
Sharing Scheme][ssss-wiki]. It can be used to split a message like:

    the password is foobar

into keys like:

    AcHdSbX8yBsngpwlj/RnLL4KdWMZz/wXHCbUyIn8OrzLhX5TkGMjiSJ0KwQ=
    Apyev24dWA0xjtEczfYxHgFNKJR/ZHmWlywlLppw7dQdu5wdqKbsvvVO9Z4=
    A1xU7SdCKPTIiuoL8wMD+59w6DJd9vHp7iqBh2D/oAekWsInS+WpWLhYv+g=
    BCYYTsXCZSEdlktuSfKdemLDkmezL26JnDja/7x1XgSsx0WB2DFv0EY6VLc=
    BebSHIydFdjkknB5dwevn/z+UsGRveb25T5+Vkb6E9cVJhu7O3IqNgssHsE=

any k (in this case, 2) of which can be recombined to produce the original
message. You can use this to distribute a secret among trusted friends, relying
on them to only combine keys if some prearranged condition is met (e.g. you
lose your password and need it, or you die and want to give them access to your
information.)

To try it out, first make sure that the following hold:

- `../closure-library` (relative to the checkout
  path) points to a checkout of [Closure library][].
- `../closure-compiler/compiler.jar` points to a copy
  of the [Closure compiler][] jar.

Then, run `make` and open `app.html` in your browser. Try
pasting any two of the keys above into the combine textarea
(separated by newlines) and pressing &ldquo;Combine&rdquo;.

A precompiled version of `app.html` exists
on this project&rsquo;s [github page][].

## TODO

- Improve error handling/display in app.
- Come up with a reasonable text representation for keys and implement
  formatting/parsing for it.
- Provide an option for truly paranoid people to manually enter entropy.
- Make the code work without `TypedArray` (for rhino and older browsers).
- Use GF(2<sup>m</sup>) for larger m to allow more keys.
- Throw errors rather than using `goog.asserts.assert`,
  which is compiled away by the Closure compiler.
- Automated testing.
- Add nicer documentation.
- Once it&rsquo;s passed the &ldquo;my mom can use it&rdquo; bar, spread it
  around.

## Thanks

- The Galois Field implementation is based heavily on [James Plank&rsquo;s Fast
  Galois Field Arithmetic Library in C/C++][galois].
- The SSSS API is inspired by [point-at-infinity&rsquo;s ssss][ssss].
- Seeing [Larry Leinweber&rsquo;s GF(2<sup>m</sup>) Elliptic Curve
  Calculator][gfeccalc] got me over the initial &ldquo;waaah, I don&rsquo;t
  want to write a Galois Field library in JavaScript&rdquo; angst.
- [Clipperz][] demonstrated the feasibility of zero-knowledge web-apps and
  client-side JavaScript crypto, and is one of few programs I regularly use
  that passes the &ldquo;I have had drinks with the author&rdquo; trust-bar.
  (Incidentally, I want this to be true for more software I use.)


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
