// Used by the resolve method to execute the plugin constructor with the parameters provided.
module.exports = function(name, plugin) {
    if (!plugin.klass)
        throw new Error("Failed to resolve '" + name + "'. Expected constructor not to be null.");
    
    return (function() {
        function F(args) {
            return plugin.klass.apply(this, args);
        }

        F.prototype = plugin.klass.prototype;

        return new F(arguments);
    }).apply(this, plugin.parameters);
};
