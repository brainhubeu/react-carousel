var Path = require("path");
var Webpack = require("webpack");
var Config = require("../../");

module.exports = (function() {
    var config = new Config();

    config.merge({
        entry: "./main.js",
        output: {
            filename: "bundle.js"       
        }
    });

    config.loader("dustjs-linkedin", {
        test: /\.dust$/,
        query: {
            path: Path.join(__dirname, "views")
        }
    });

    config.loader("sass", {
        test: /\.scss$/,
        loader: "style!css!sass?indentedSyntax"
    });

    config.plugin("webpack-define", Webpack.DefinePlugin, [{
        VERSION: "1.0.0"
    }]);

    return config.resolve();
})();
