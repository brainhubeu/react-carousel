LICENSE_COMMENT="/*! linked-list 0.1.0 Original author Titus Wormer <tituswormer@gmail.com>. Released under the MIT license. @preserve */"

clean:
	@rm -rf _destination
	@mkdir -p _destination

_destination/linked-list.js:
	@echo $(LICENSE_COMMENT) > _destination/linked-list.max.js
	@cat _source/linked-list.js >> _destination/linked-list.max.js
	@./node_modules/.bin/uglifyjs _destination/linked-list.max.js --unsafe -nmf > _destination/linked-list.js

_destination/linked-list.globals.js:
	@echo $(LICENSE_COMMENT) > _destination/linked-list.globals.max.js
	@echo "(function(root){\
	var module={}, exports = module.exports = {};" >> _destination/linked-list.globals.max.js
	@cat _source/linked-list.js >> _destination/linked-list.globals.max.js
	@echo "root.LinkedList = module.exports;\
	}(this));" >> _destination/linked-list.globals.max.js
	@./node_modules/.bin/uglifyjs _destination/linked-list.globals.max.js --unsafe -nmf > _destination/linked-list.globals.js

_destination/linked-list.amd.js:
	@echo $(LICENSE_COMMENT) > _destination/linked-list.amd.max.js
	@echo "define(function() {\
	var module={}, exports = module.exports = {};" >> _destination/linked-list.amd.max.js
	@cat _source/linked-list.js >> _destination/linked-list.amd.max.js
	@echo "return module.exports;\
	});" >> _destination/linked-list.amd.max.js
	@./node_modules/.bin/uglifyjs _destination/linked-list.amd.max.js --unsafe -nmf > _destination/linked-list.amd.js

build: clean _destination/linked-list.js _destination/linked-list.globals.js _destination/linked-list.amd.js

lint:
	@./node_modules/.bin/jshint _source/*.js

.PHONY: lint clean
