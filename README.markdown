# SSSS Lockbox

This is a distributed lockbox based on [Shamir&rsquo;s Secret
Sharing Scheme][ssss]. It can be used to split a message like:

    the password is foobar

into keys like:

    AcHdSbX8yBsngpwlj/RnLL4KdWMZz/wXHCbUyIn8OrzLhX5TkGMjiSJ0KwQ=
    Apyev24dWA0xjtEczfYxHgFNKJR/ZHmWlywlLppw7dQdu5wdqKbsvvVO9Z4=
    A1xU7SdCKPTIiuoL8wMD+59w6DJd9vHp7iqBh2D/oAekWsInS+WpWLhYv+g=
    BCYYTsXCZSEdlktuSfKdemLDkmezL26JnDja/7x1XgSsx0WB2DFv0EY6VLc=
    BebSHIydFdjkknB5dwevn/z+UsGRveb25T5+Vkb6E9cVJhu7O3IqNgssHsE=

that can be recombined to produce the original message.

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
- Use a more robust source of entropy than `Math.random`. Ideally also
  provide an option for truly paranoid people to manually enter dice rolls.
- Make the code work without `TypedArray` (for rhino and older browsers).
- Use GF(2<sup>m</sup>) for larger m to allow more keys.
- Throw errors rather than using `goog.asserts.assert`,
  which is compiled away by the Closure compiler.
- Automated testing.
- Add nicer documentation.
- Spread it around.


[closure library]:  http://code.google.com/p/closure-library  "Closure Library"
[closure compiler]: http://code.google.com/p/closure-compiler "Closure Compiler"
[github page]:      http://mrdomino.github.com/lockbox/       "SSSS Lockbox"
[ssss]:             https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing
    "Shamir's Secret Sharing Scheme"
