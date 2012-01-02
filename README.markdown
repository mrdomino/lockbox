# SSSS Lockbox

This is a distributed lockbox based on [Shamir&rsquo;s Secret
Sharing Scheme][ssss]. It can be used to split a message like:

    the password is foobar

into keys like:

    ATm+26TTvy0w0Q+DIcxd7reSLlo1SzU=
    Au7ZBDUrwM/1Jq+N7uUBVBOT7QXMNfw=
    A6MPurGIHpG2gM98qwk1yYRnrDCbH7s=
    BF0XpwrGPhZi1fKRbbe5PUaRdrsjyXM=
    BRDBGY5l4Eghc5JgKFuNoNFlN4504zQ=

that can be recombined to produce the original message.

To try it out, first make sure that the following hold:

- `../closure-library` (relative to the checkout
  path) points to a checkout of [closure-library][].
- `../closure-compiler/compiler.jar` points to a copy
  of the [closure-compiler][] jar.

Then, run `make` and open `app.html` in your browser. Try
pasting any two of the keys above into the combine textarea
(separated by newlines) and pressing &ldquo;Combine&rdquo;.

A precompiled version of `app.html` exists on this project’s [github
page][github-page].

## TODO

- Implement message verification, probably by embedding
  a hash or checksum in the generated keys somehow.
- Use a more robust source of entropy than `Math.random`. Ideally also
  provide an option for truly paranoid people to manually enter dice rolls.
- Make the code work without `TypedArray` (for rhino and older browsers).
- Use GF(2<sup>m</sup>) for larger m to allow more keys.
- Throw errors rather than using `goog.asserts.assert`,
  which is compiled away by the Closure compiler.
- Add nicer documentation.

[closure-library]:  http://code.google.com/p/closure-library  'Closure Library'
[closure-compiler]: http://code.google.com/p/closure-compiler 'Closure Compiler'
[github-page]:      http://mrdomino.github.com/lockbox/       'SSSS Lockbox'
[ssss]:             https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing
    "Shamir's Secret Sharing Scheme"
