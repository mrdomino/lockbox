COMPILER_JAR=compiler.jar
COMPILER_ZIP=compiler-latest.zip
COMPILER_URL=http://dl.google.com/closure-compiler/compiler-latest.zip

all: $(COMPILER_JAR)

$(COMPILER_JAR): $(COMPILER_ZIP)
	unzip $< $@
	touch $@

$(COMPILER_ZIP):
	curl -o $@ $(COMPILER_URL)

distclean:
	rm $(COMPILER_JAR) $(COMPILER_ZIP)
