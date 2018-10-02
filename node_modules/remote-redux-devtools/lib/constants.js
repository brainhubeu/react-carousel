'use strict';

exports.__esModule = true;
var defaultSocketOptions = exports.defaultSocketOptions = {
  secure: true,
  hostname: 'remotedev.io',
  port: 443,
  autoReconnect: true,
  autoReconnectOptions: {
    randomness: 30000
  }
};