CLOSURE_LIBRARY=../closure-library
CLOSURE_COMPILER_JAR=../closure-compiler/compiler.jar
CLOSURE_BUILD=$(CLOSURE_LIBRARY)/closure/bin/build
CLOSUREBUILDER=$(CLOSURE_BUILD)/closurebuilder.py
DEPSWRITER=$(CLOSURE_BUILD)/depswriter.py
PREFIX=../../../lockbox
JS=gf28.js ssss.js comb.js

all: gf28-compiled.js ssss-compiled.js deps.js

%-compiled.js: %.js
	$(CLOSUREBUILDER) --root=$(CLOSURE_LIBRARY) --root=. --namespace=$* --output_mode=compiled --compiler_jar=$(CLOSURE_COMPILER_JAR) --compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS --compiler_flags=--warning_level=VERBOSE --compiler_flags=--output_wrapper="(function(){%output%})()" > $@

deps.js: $(JS)
	$(DEPSWRITER) --root_with_prefix='. $(PREFIX)' > $@

clean:
	rm *-compiled.js deps.js
