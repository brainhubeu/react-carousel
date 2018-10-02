'use strict';

module.exports = function getMetaRedirect(toPath) {
  var url = toPath.trim();

  var hasProtocol = url.includes('://');
  if (!hasProtocol) {
    var hasLeadingSlash = url.startsWith('/');
    if (!hasLeadingSlash) {
      url = `/${url}`;
    }

    var resemblesFile = url.includes('.');
    if (!resemblesFile) {
      url = `${url}/`.replace(/\/\/+/g, '/');
    }
  }

  return `<meta http-equiv="refresh" content="0; URL='${url}'" />`;
};