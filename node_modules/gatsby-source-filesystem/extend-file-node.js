"use strict";

var _require = require(`graphql`),
    GraphQLString = _require.GraphQLString;

var fs = require(`fs-extra`);
var path = require(`path`);

module.exports = function (_ref) {
  var type = _ref.type,
      getNodeAndSavePathDependency = _ref.getNodeAndSavePathDependency,
      _ref$pathPrefix = _ref.pathPrefix,
      pathPrefix = _ref$pathPrefix === undefined ? `` : _ref$pathPrefix;

  if (type.name !== `File`) {
    return {};
  }

  return {
    publicURL: {
      type: GraphQLString,
      args: {},
      description: `Copy file to static directory and return public url to it`,
      resolve: function resolve(file, fieldArgs, context) {
        var details = getNodeAndSavePathDependency(file.id, context.path);
        var fileName = `${file.name}-${file.internal.contentDigest}${details.ext}`;

        var publicPath = path.join(process.cwd(), `public`, `static`, fileName);

        if (!fs.existsSync(publicPath)) {
          fs.copy(details.absolutePath, publicPath, function (err) {
            if (err) {
              console.error(`error copying file from ${details.absolutePath} to ${publicPath}`, err);
            }
          });
        }

        return `${pathPrefix}/static/${fileName}`;
      }
    }
  };
};