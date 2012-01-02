LIBRARY_ROOT=../closure-library
COMPILER_JAR=../closure-compiler/compiler.jar
COMPILER_FLAGS=--compilation_level=ADVANCED_OPTIMIZATIONS --warning_level=VERBOSE --output_wrapper="(function(){%output%})()" --externs=$(EXTERNS)
CLOSURE_BUILD=$(LIBRARY_ROOT)/closure/bin/build
CLOSUREBUILDER=$(CLOSURE_BUILD)/closurebuilder.py
DEPSWRITER=$(CLOSURE_BUILD)/depswriter.py
PREFIX=../../../lockbox
MODULES=app gf28 ssss comb
JS=$(foreach mod, $(MODULES), $(mod).js)
JSOUT=$(foreach mod, $(MODULES), $(mod)-compiled.js)
EXTERNS=externs.js

all: $(JSOUT) deps.js

%-compiled.js: %.js
	$(CLOSUREBUILDER) --root=$(LIBRARY_ROOT) --root=. --namespace=$* --output_mode=compiled --compiler_jar=$(COMPILER_JAR) $(foreach flag,$(COMPILER_FLAGS),--compiler_flag=$(flag)) > $@

deps.js: $(JS)
	$(DEPSWRITER) --root_with_prefix='. $(PREFIX)' > $@

clean:
	-rm $(JSOUT) deps.js
