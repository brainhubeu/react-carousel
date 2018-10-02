const GithubSlugger = require('github-slugger');

const addItemToMenu = (sidemenu, file, url, hash, title, depth, currentDepth) => {
  currentDepth = currentDepth || 2; // h1 are excluded

  if (depth === currentDepth) {
    sidemenu.push({ file, url: `${url}${hash}`, title, items: [] });
  } else {
    currentDepth++;
    const last = sidemenu.pop();
    if (last) {
      addItemToMenu(last.items, file, url, hash, title, depth, currentDepth);
      sidemenu.push(last);
    }
  }
};

const createSideMenu = (activeData, data) => {
  const slugger = new GithubSlugger();
  activeData.depthOfMenu = (activeData.depthOfMenu || 6) + 1; // menu starts from h2
  const sidemenu = [];

  const matchedMarkdownEdge = data.allMarkdownRemark.edges
    .find(edge => edge.node.fileAbsolutePath === activeData.absolutePath);

  if (!matchedMarkdownEdge) {
    return [];
  }

  matchedMarkdownEdge.node.headings
    .filter(child => child.depth >= 2 && child.depth <= activeData.depthOfMenu)
    .map(child => ({
      hash: `#${slugger.slug(child.value)}`,
      depth: child.depth,
      value: child.value,
    }))
    .map(child => addItemToMenu(sidemenu, activeData.file, activeData.url, child.hash, child.value, child.depth));
  return sidemenu;
};

export default createSideMenu;

/**
 * Determines whether page has sidemenu
 * @param {Object} page
 * @return {Boolean}
 */
export const hasSideMenu = page => !!page && !!page.sidemenu && !!page.sidemenu.length;
