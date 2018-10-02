var _ = require("lodash");

// Used by the resolve method to modify the loader config before appending to the module.[pre|post]loaders.
module.exports = function(name, loader) {
    var config;
    
    loader = _.clone(loader, true);
        
    if (loader.resolver)
        loader.config = loader.resolver(_.clone(loader.config, true), name);

    config = loader.config;

    if (!config.loader && !config.loaders)
        config.loader = name;

    return config;
};
