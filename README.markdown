# SSSS Lockbox

This is a distributed lockbox based on Shamir's Secret Sharing Scheme. It can be
used to split a message like:

    the password is foobar

into keys like:

    ASxzW03VbzyeGtO3gxtz44JIg+3QM1I=
    AsReGfonfe20rQrlt1ZdTnk6qnYbxTI=
    A5xFJ5eCc6JZwLYgUG1H3tsURvSplxI=

that can be recombined to produce the original message.

To try it out, first make sure that the following hold:

- `../closure-library` (relative to the checkout path) points to a checkout of [closure-library][].
- `../closure-compiler/compiler.jar` points to a copy of the [Closure compiler][closure-compiler] jar.

Then, run `make` and open [app.html](app.html) in your browser. Try pasting any two
of the keys above into the combine textarea (separated by newlines) and pressing
"Combine".

## TODO

- Implement message verification, probably by embedding a hash or checksum in
  the generated keys somehow.
- Use a more robust source of entropy than `Math.random` -- ideally also provide
  an option for truly paranoid people to manually enter dice rolls.
- Make the code work without TypedArray (for use in rhino and older browsers).
- Use GF(2^m) for larger m to allow more keys.
- Throw errors rather than using goog.asserts.assert, which is possibly compiled
  away by the Closure compiler.
- Add nicer documentation.

[closure-library]: http://code.google.com/p/closure-library 'Closure Library'
[closure-compiler]: http://code.google.com/p/closure-compiler 'Closure Compiler'
