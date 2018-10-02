"use strict";

exports.__esModule = true;
exports.connectionFromArray = connectionFromArray;
exports.connectionFromPromisedArray = connectionFromPromisedArray;


/**
 * A function that accepts an array and connection arguments, and returns
 * a connection object for use in GraphQL. It uses array offsets as pagination,
 * so pagination will only work if the array is static.
 */
function connectionFromArray(data, args) {
  var skip = args.skip,
      limit = args.limit;

  var startSlice = 0;
  var endSlice = data.length;

  if (typeof skip === `number`) {
    if (skip < 0) {
      throw new Error(`Argument "skip" must be a non-negative integer`);
    }

    startSlice = skip;
  }
  if (typeof limit === `number`) {
    if (limit < 0) {
      throw new Error(`Argument "limit" must be a non-negative integer`);
    }

    endSlice = startSlice + limit;
  }

  var slice = data.slice(startSlice, endSlice);
  var edges = slice.map(function (value, index) {
    var orgIndex = startSlice + index;
    var next = void 0;
    var previous = void 0;
    if (orgIndex + 1 < data.length) {
      next = data[orgIndex + 1];
    }
    if (orgIndex !== 0) {
      previous = data[orgIndex - 1];
    }
    return {
      node: value,
      next,
      previous
    };
  });

  return {
    edges,
    pageInfo: {
      hasNextPage: typeof limit === `number` ? limit + startSlice - 1 < data.length : false
    }
  };
}

/**
 * A version of `connectionFromArray` that takes a promised array, and returns a
 * promised connection.
 */


function connectionFromPromisedArray(dataPromise, args) {
  return dataPromise.then(function (data) {
    return connectionFromArray(data, args);
  });
}