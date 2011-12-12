all: gf28-compiled.js

gf28-compiled.js: gf28.js
	../closure-library/closure/bin/build/closurebuilder.py --root=../closure-library --root=. --namespace=gf28 --output_mode=compiled --compiler_jar=../closure-compiler/compiler.jar --compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS --compiler_flags=--warning_level=VERBOSE > $@

clean:
	rm gf28-compiled.js
