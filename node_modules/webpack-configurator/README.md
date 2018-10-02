# Webpack Configurator

## Install

```
$ npm install webpack-configurator
````

## Motivation

In a number of my old projects, I found it difficult to DRY up the configuration files. My setup often contained a number of build modes (e.g. dev, test, and production), each sharing similar parts to one another. These common chunks were placed in a 'base' build mode. I wanted to still maintain the flexibility of including build mode specific configuration, while at the same time making slight changes to things such as loader query strings. In the end, I still found that my build mode files contained repetitive boilerplate code that I really wanted to avoid.

## API

### config.merge(config)

<!-- Description of why you might want to use this method. -->

**Arguments**

1. `config` *(Object|Function)*: If an object is passed, this will be merged with the current value of config._config using the default way of merging (concat arrays nested within the data structure). If a function is passed, the first parameter will be a copy of the value contained within config._config. You can then make all the necessary changes to the data structure before returning the new value.

**Returns**

*`(Object)`*: The config object to allow function chaining.

**Example**

```javascript
// Config as an object.
config.merge({
     entry: "./app.entry.js"
});

// Config as a function.
config.merge(function(current) {
    current.entry = "./app.entry.js";

    return current;
});
```

### config.loader(key, config, resolver)

Provides a way of adding loaders to the config. You can add two other types of loaders using `config.preLoader` and `config.postLoader`.

**Arguments**

1. `key` *(String)*: Name of the loader. This is used to differentiate between loaders when merging/extending. When resolving, this value is used as a fallback for the 'loader' property value.
2. `config` *(Object|Function)*: If an object is passed, this will be merged with the current value of the loader's config using the default way of merging (concat arrays nested within the data structure). If a function is passed, the first parameter will be a copy of the loader's config. You can then make all the necessary changes to the data structure before returning the new value.
3. `resolver` *(Function)*: This works in a similar way to the `config` parameter, however, it is only called when resolving. It provides an opportunity to make final changes once the configuration is has been completely merged. **Note**: If the loader already has a resolver, the value will simply get replaced.

**Returns**

*`(Object)`*: The config object to allow function chaining.

**Examples**

Config as an object.
```javascript
config.loader("dustjs-linkedin", {
    test: /\.dust$/
});
```

Config as a function.
```javascript
config.loader("dustjs-linkedin", function(current) {
    current.test = /\.dust$/;
    
    return current;
});
```

Config as an object with a resolver function.
```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin');

config.loader("sass", {
    test: /\.scss$/,
    queries: {
        css: {
            sourceMap: true
        },
        sass: {
            sourceMap: true
        }
    }
}, function(config) {
    var loaders = [];

    for (var key in config.queries)
        loaders.push(key + "?" + JSON.stringify(config.queries[key]));

    config.loader = ExtractTextPlugin.extract(loaders.join("!"));

    return config;
});
```
<!--- An example of how merging works. -->

### config.removeLoader(key)

Provides a way to remove loaders without directly modifying internal data structures on the instance. You can remove two other types of loaders using the following: `config.removePreLoader(key)` and `config.removePostLoader(key)`.

**Arguments**

1. `key` *(String)*: Name of the loader you wish to remove. This is the same value used when calling the 'loader' method.

**Returns**

*`(Object)`*: The config object to allow function chaining.

**Example**

```javascript
// Create a loader with the key 'dustjs-linkedin'
config.loader("dustjs-linkedin", {
    test: /\.dust$/
});

// Remove the loader using the same key as above.
config.removeLoader("dustjs-linkedin");
```

### config.plugin(key, constructor, parameters)

<!-- Description of why you might want to use this method. -->

**Arguments**

1. `key` *(String)*: Name of the plugin. This is used to differentiate between plugins when merging/extending.
2. `constructor` *(Class)*: The class constructor that you wish to be instantiated when resolving. **Note**: If the plugin already has a constructor, the value will simply get replaced. You may merge/extend `parameters` by passing null for this parameter.
3. `parameters` *(Array|Function)*: If an array is passed, this will be merged with the current value of the plugin's parameters using the default way of merging (concat arrays nested within the data structure). If a function is passed, the first parameter will be a copy of the plugin's parameters array. You can then make all the necessary changes to the data structure before returning the new value. **Note** This must be an array.

**Returns**

*`(Object)`*: The config object to allow function chaining.

**Examples**

Parameters as an array.
```javascript
var Webpack = require("webpack");

config.plugin("webpack-define", Webpack.DefinePlugin, [{
    __DEV__: true
}]);
```

Parameters as a function.
```javascript
var Webpack = require("webpack");

config.plugin("webpack-define", Webpack.DefinePlugin, function(current) {
    return [{
        __DEV__: true
    }];
});
```

### config.removePlugin(key)

<!-- Description of why you might want to use this method. -->

**Arguments**

1. `key` *(String)*: Name of the plugin you wish to remove. This is the same value used when calling the 'plugin' method.

**Returns**

*`(Object)`*: The config object to allow function chaining.

**Example**

```javascript
var Webpack = require("webpack");

// Create a plugin with the key 'webpack-define'.
config.plugin("webpack-define", Webpack.DefinePlugin, [{
    __DEV__: true
}]);

// Remove the plugin using the same key as above.
config.removePlugin("webpack-define");
```

<!-- Show how it's more useful when extending... -->

### config.resolve()

Call when you want to return a complete Webpack configuration object, typically at the end. It can be called numerous times since it doesn't produce any side effects.

**Returns**

*`(Object)`*: A valid Webpack configuration object

**Examples**

A simple webpack.config.js file demonstrating the module's use.
```javascript
var Config = require("webpack-configurator");
var Webpack = require("webpack");

module.exports = (function() {
    var config = new Config();

    config.merge({
        entry: "./main.js",
        output: {
            filename: "bundle.js"       
        }
    });

    config.loader("dustjs-linkedin", {
        test: /\.dust$/
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
```
