all:
	( cd closure-compiler && make all )
	( cd lockbox && make all )
	make index.html

clean:
	( cd lockbox && make clean )

distclean:
	( cd lockbox && make distclean )
	( cd closure-compiler && make distclean )

.PHONY: all clean distclean

index.html: lockbox/app-compiled.js lockbox/app.html
	sh gen-index.sh > $@
