all:
	( cd closure-compiler && make all )
	( cd lockbox && make all )

clean:
	( cd lockbox && make clean )

distclean:
	( cd lockbox && make distclean )
	( cd closure-compiler && make distclean )

.PHONY: all clean distclean
