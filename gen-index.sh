#!/bin/sh
sed lockbox/app.html -e '/<script src="app-compiled.js"><\/script>/{
  i <script>
  r lockbox/app-compiled.js
  a </script>
  d
}'
