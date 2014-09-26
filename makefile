CHECKSUM=sha256sum

all: index.html check

clean:
	( cd lockbox && make clean )

distclean:
	( cd lockbox && make distclean )
	( cd closure-compiler && make distclean )

.PHONY: all clean distclean

recurse-all:
	( cd closure-compiler && make all )
	( cd lockbox && make all )

check: index.sha256 index.html
	$(CHECKSUM) -c $<

#index.sha256: index.html
#	$(CHECKSUM) $< > $@

index.html: recurse-all
	sh gen-index.sh > $@

