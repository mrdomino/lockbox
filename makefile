# Edit these to match your environment.
LIBRARY_ROOT=../closure-library
COMPILER_JAR=../closure-compiler/compiler.jar
# PREFIX is relative to $(LIBRARY_ROOT)/closure
PREFIX=../../../lockbox
COMPILER_FLAGS=--compilation_level=ADVANCED_OPTIMIZATIONS --warning_level=VERBOSE --output_wrapper="(function(){%output%})()" --externs=$(EXTERNS)

# Don't touch these unless you're modifying the source.
MODULES=app gf28 ssss comb message rng
EXTERNS=externs.js

# You should almost never have any reason to touch anything below this line. ###

CLOSURE_BUILD=$(LIBRARY_ROOT)/closure/bin/build
CLOSUREBUILDER=$(CLOSURE_BUILD)/closurebuilder.py
DEPSWRITER=$(CLOSURE_BUILD)/depswriter.py
JS=$(foreach mod, $(MODULES), $(mod).js)
JSOUT=$(foreach mod, $(MODULES), $(mod)-compiled.js)

all: $(JSOUT) deps.js

%-compiled.js: %.js
	$(CLOSUREBUILDER) --root=$(LIBRARY_ROOT) --root=. --namespace=$* \
		--output_mode=compiled --compiler_jar=$(COMPILER_JAR) \
		$(foreach flag,$(COMPILER_FLAGS),--compiler_flag=$(flag)) > $@

deps.js: $(JS)
	$(DEPSWRITER) --root_with_prefix='. $(PREFIX)' > $@

clean:
	-rm $(JSOUT) deps.js
