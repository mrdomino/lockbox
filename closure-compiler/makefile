COMPILER_JAR=compiler.jar
COMPILER_ZIP=compiler-latest.zip
COMPILER_URL=http://dl.google.com/closure-compiler/compiler-20140923.zip
CHECKSUM=sha256sum

all: $(COMPILER_JAR) check

check: compiler.sha256
	$(CHECKSUM) -c $<

#compiler.sha256: $(COMPILER_JAR)
#	$(CHECKSUM) $< > $@

$(COMPILER_JAR): $(COMPILER_ZIP)
	unzip $< $@
	touch $@

$(COMPILER_ZIP):
	curl -o $@ $(COMPILER_URL)

distclean:
	rm $(COMPILER_JAR) $(COMPILER_ZIP)

.PHONY: all check distclean
