uglifyjs sfx-core.js -cm --screw-ie8 | sed 's/.$//' > sfx-core.min.js
uglifyjs global-helpers.js -cm --screw-ie8 > global-helpers.min.js
