var _ = require("lodash");
var defaultMerge = require("./default/merge");

// Returns a successfully merged loader. This function helps DRY up the following: preLoader, loader, and postLoader.
// They all perform the same task but attach the returned value to a different data structure.
// Used by [pre|post]loader methods to merge the given configuration into the the internal data stores.
module.exports = function(loader, name, config, resolver) {
    loader = (_.clone(loader, true) || {});

    if (!_.isString(name))
        throw new Error("Invalid 'name' parameter. You must provide a string.");
    
    if (_.isArray(config) || (!_.isNull(config) && !_.isObject(config) && !_.isFunction(config)))
        throw new Error("Invalid 'config' parameter. You must provide either an object, function, or null.");

    if (typeof config == "function")
        loader.config = config(_.clone(loader.config, true) || {});
    else
        _.merge(loader, {config: config}, defaultMerge);
    
    if (resolver)
        loader.resolver = resolver;

    return loader;
};
