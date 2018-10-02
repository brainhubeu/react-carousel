'use strict';
/**
 * Get menu from graphql data layer
 * @param {GraphQl} graphql
 * @return {Promise} pages
 */
function getMenu(graphql) {
  return graphql(`
    {
      menu {
        pages
      }
    }
    `)
    .then(result => result.data.menu.pages);
}

module.exports = getMenu;
