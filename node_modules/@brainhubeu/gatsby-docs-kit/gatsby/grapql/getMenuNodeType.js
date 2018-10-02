'use strict';

const GraphQLJson = require('graphql-type-json');

module.exports = ({ type }) => {
  if (type.name !== 'Menu') {
    return;
  }
  return {
    pages: { type: GraphQLJson },
  };
};
