"use strict";

/*  weak */
var serve = require(`serve`);
var signalExit = require(`signal-exit`);

module.exports = function (program) {
  var port = program.port,
      open = program.open,
      directory = program.directory;

  port = typeof port === `string` ? parseInt(port, 10) : port;

  var server = serve(`${directory}/public`, { port, open });

  signalExit(function (code, signal) {
    server.stop();
  });
};
//# sourceMappingURL=serve.js.map