var _ = require("lodash");
var resolveLoader = require("./lib/resolve/loader");
var resolvePlugin = require("./lib/resolve/plugin");
var defaultMerge = require("./lib/default/merge");
var mergeLoader = require("./lib/mergeLoader");

function Config() {
    this._config = {};

    this._preLoaders = {};
    this._loaders = {};
    this._postLoaders = {};

    this._plugins = {};
}

// This method provides full customisation of how the configuration object is built. It is also used as a base when resolving.
// TODO: If the config function doesn't return a valid, use the value we passed in, assuming the user forgot to return.
Config.prototype.merge = function(config) {
    if (!_.isObject(config) && !_.isFunction(config))
        throw new Error("Invalid Parameter. You must provide either an object or a function.");
    
    if (typeof config == "function") {
        var clonedConfig = _.clone(this._config, true, function(value) {
            if (!_.isPlainObject(value))
            return value;
        });
        this._config = config(clonedConfig || {});
    } else {
        _.merge(this._config, config, defaultMerge);
    }
    
    return this;
};

// Almost an alias of loader only we assign to this._preLoaders.
Config.prototype.preLoader = function(name, config, resolver) {
    var args = Array.prototype.slice.call(arguments);

    // Add the current value of the loader. On creation of a loader, this will be undefined.
    args.unshift(this._preLoaders[name]);

    // Assign the newly merged loader to the internal data store.
    this._preLoaders[name] = mergeLoader.apply(this, args);

    // Return 'this' to allow chaining.
    return this;
};

Config.prototype.removePreLoader = function(key) {
    delete this._preLoaders[key];

    return this;
};

// This method is a helper for creating loaders. It requires a name to make merging easier when identifying loaders.
// There may be some cases where a resolver is needed. A good example is the ExtractTextPlugin. Using the resolver
// parameter, it is possible to call ExtractTextPlugin.extract when resolving, to ensure we have the fully merged
// loader config.
Config.prototype.loader = function(name, config, resolver) {
    var args = Array.prototype.slice.call(arguments);
    
    // Append the loader object.
    args.unshift(this._loaders[name]);
    
    // Assign the newly merged loader to the internal data store.
    this._loaders[name] = mergeLoader.apply(this, args);

    // Return 'this' to allow chaining.
    return this;
};

Config.prototype.removeLoader = function(key) {
    delete this._loaders[key];
    
    return this;
};

// Almost an alias of loader only we assign to this._postLoaders.
Config.prototype.postLoader = function(name, config, resolver) {
    var args = Array.prototype.slice.call(arguments);

    // Add the current value of the loader. On creation of a loader, this will be undefined.
    args.unshift(this._postLoaders[name]);

    // Assign the newly merged loader to the internal data store.
    this._postLoaders[name] = mergeLoader.apply(this, args);

    // Return 'this' to allow chaining.
    return this;
};

Config.prototype.removePostLoader = function(key) {
    delete this._postLoaders[key];
    
    return this;
};

// A method for creating/exending a plugin. It is similar to a loader in respect to the name parameter.
// From all the examples of plugins I've seen, it seems constructors are always used. This will be instantiated when
// resolving, passing the value of parameters.
Config.prototype.plugin = function(name, constructor, parameters) {
    var plugin = (_.clone(this._plugins[name], true) || {});
    var resolvedParameters;

    if (!_.isString(name))
        throw new Error("Invalid 'name' parameter. You must provide a string.");
    
    if (!_.isNull(constructor) && !_.isFunction(constructor))
        throw new Error("Invalid 'constructor' parameter. You must provide either a function or null.");

    if (parameters && !_.isFunction(parameters) && !_.isArray(parameters))
        throw new TypeError("The optional 'parameters' argument must be an array or a function.");
    
    if (parameters) {
        if (_.isFunction(parameters)) {
            resolvedParameters = parameters(_.clone(plugin.parameters, true) || []);

            if (!_.isArray(resolvedParameters))
                throw new TypeError("The 'parameters' argument must return an array.");
            
            plugin.parameters = resolvedParameters;
        } else {
            _.merge(plugin, {parameters: parameters}, defaultMerge);
        }
    }
    
    if (constructor)
        plugin.klass = constructor;

    this._plugins[name] = plugin;

    return this;
};

Config.prototype.removePlugin = function(key) {
    delete this._plugins[key];

    return this;
};

// This method returns a valid Webpack object. It should not produce any side-effects and therefore can be called as
// many times as you want.
Config.prototype.resolve = function() {
    // It's possible that non-plain objects (such as instances) could exist within the config (e.g. calling the merge
    // method to define plugins).
    var config = _.clone(this._config, true, function(value) {
        if (!_.isPlainObject(value))
            return value;
    });
    var plugins = [];

    // Resolve each type of loader.
    ["preLoaders", "loaders", "postLoaders"].forEach(function(property) {
        var map = this["_" + property];
        var loaders = [];
        var module = {};
        var loader;

        if (!Object.keys(map).length)
            return;
        
        for (var name in map) {
            loader = map[name];

            loaders.push(resolveLoader(name, loader));
        }

        config.module = (config.module || {});
            
        module[property] = loaders;
            
        _.merge(config.module, module, defaultMerge);
    }, this);

    // Resolve each plugin. This will basically do: new MyPlugin.apply(MyPlugin, parameters).
    for (var name in this._plugins) {
        var plugin = this._plugins[name];

        plugins.push(resolvePlugin(name, plugin));
    }

    if (plugins.length)
        config.plugins = (config.plugins || []).concat(plugins);
    
    return config;
};

module.exports = Config;
