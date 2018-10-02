"use strict";

exports.__esModule = true;

var _connection = require("./connection/connection.js");

Object.defineProperty(exports, "connectionArgs", {
  enumerable: true,
  get: function get() {
    return _connection.connectionArgs;
  }
});
Object.defineProperty(exports, "connectionDefinitions", {
  enumerable: true,
  get: function get() {
    return _connection.connectionDefinitions;
  }
});

var _arrayconnection = require("./connection/arrayconnection.js");

Object.defineProperty(exports, "connectionFromArray", {
  enumerable: true,
  get: function get() {
    return _arrayconnection.connectionFromArray;
  }
});