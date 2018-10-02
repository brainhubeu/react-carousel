"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _joi3 = require("../joi-schemas/joi");

var joiSchemas = _interopRequireWildcard(_joi3);

var _jsChunkNames = require("../utils/js-chunk-names");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require(`lodash`);

var _require = require(`redux`),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require(`common-tags`),
    stripIndent = _require2.stripIndent;

var report = require(`gatsby-cli/lib/reporter`);
var glob = require(`glob`);
var path = require(`path`);
var fs = require(`fs`);

var _require3 = require(`../utils/path`),
    joinPath = _require3.joinPath;

var _require4 = require(`./index`),
    hasNodeChanged = _require4.hasNodeChanged,
    getNode = _require4.getNode;

var _require5 = require(`../schema/node-tracking`),
    trackInlineObjectsInRootNode = _require5.trackInlineObjectsInRootNode;

var _require6 = require(`./index`),
    store = _require6.store;

var actions = {};

var findChildrenRecursively = function findChildrenRecursively() {
  var _children;

  var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  children = (_children = children).concat.apply(_children, children.map(function (child) {
    var newChildren = getNode(child).children;
    if (_.isArray(newChildren) && newChildren.length > 0) {
      return findChildrenRecursively(newChildren);
    } else {
      return [];
    }
  }));

  return children;
};

/**
 * Delete a page
 * @param {Object} page a page object with at least the path set
 * @param {string} page.path The path of the page
 * @param {string} page.component The absolute path to the page component
 * @example
 * deletePage(page)
 */
actions.deletePage = function (page) {
  return {
    type: `DELETE_PAGE`,
    payload: page
  };
};

var pascalCase = _.flow(_.camelCase, _.upperFirst);
var hasWarnedForPageComponent = new Set();
/**
 * Create a page. See [the guide on creating and modifying pages](/docs/creating-and-modifying-pages/)
 * for detailed documenation about creating pages.
 * @param {Object} page a page object
 * @param {string} page.path Any valid URL. Must start with a forward slash
 * @param {string} page.component The absolute path to the component for this page
 * @param {string} page.layout The name of the layout for this page. By default
 * `'index'` layout is used
 * @param {Object} page.context Context data for this page. Passed as props
 * to the component `this.props.pathContext` as well as to the graphql query
 * as graphql arguments.
 * @example
 * createPage({
 *   path: `/my-sweet-new-page/`,
 *   component: path.resolve(`./src/templates/my-sweet-new-page.js`),
 *   // If you have a layout component at src/layouts/blog-layout.js
 *   layout: `blog-layout`,
 *   // The context is passed as props to the component as well
 *   // as into the component's GraphQL query.
 *   context: {
 *     id: `123456`,
 *   },
 * })
 */
actions.createPage = function (page, plugin, traceId) {
  var noPageOrComponent = false;
  var name = `The plugin "${plugin.name}"`;
  if (plugin.name === `default-site-plugin`) {
    name = `Your site's "gatsby-node.js"`;
  }
  if (!page.path) {
    var message = `${name} must set the page path when creating a page`;
    // Don't log out when testing
    if (process.env.NODE_ENV !== `test`) {
      console.log(_chalk2.default.bold.red(message));
      console.log(``);
      console.log(page);
    } else {
      return message;
    }
    noPageOrComponent = true;
  }

  // Validate that the context object doesn't overlap with any core page fields
  // as this will cause trouble when running graphql queries.
  if (_.isObject(page.context)) {
    var reservedFields = [`path`, `matchPath`, `component`, `componentChunkName`, `pluginCreator___NODE`, `pluginCreatorName`];
    var invalidFields = Object.keys(_.pick(page.context, reservedFields));

    var singularMessage = `${name} used a reserved field name in the context object when creating a page:`;
    var pluralMessage = `${name} used reserved field names in the context object when creating a page:`;
    if (invalidFields.length > 0) {
      var error = `${invalidFields.length === 1 ? singularMessage : pluralMessage}

${invalidFields.map(function (f) {
        return `  * "${f}"`;
      }).join(`\n`)}

${JSON.stringify(page, null, 4)}

Data in "context" is passed to GraphQL as potential arguments when running the
page query.

When arguments for GraphQL are constructed, the context object is combined with
the page object so *both* page object and context data are available as
arguments. So you don't need to add the page "path" to the context as it's
already available in GraphQL. If a context field duplicates a field already
used by the page object, this can break functionality within Gatsby so must be
avoided.

Please choose another name for the conflicting fields.

The following fields are used by the page object and should be avoided.

${reservedFields.map(function (f) {
        return `  * "${f}"`;
      }).join(`\n`)}

            `;
      if (process.env.NODE_ENV === `test`) {
        return error;
        // Only error if the context version is different than the page
        // version.  People in v1 often thought that they needed to also pass
        // the path to context for it to be available in GraphQL
      } else if (invalidFields.some(function (f) {
        return page.context[f] !== page[f];
      })) {
        report.panic(error);
      } else {
        if (!hasWarnedForPageComponent.has(page.component)) {
          report.warn(error);
          hasWarnedForPageComponent.add(page.component);
        }
      }
    }
  }

  // Don't check if the component exists during tests as we use a lot of fake
  // component paths.
  if (process.env.NODE_ENV !== `test`) {
    if (!fs.existsSync(page.component)) {
      var _message = `${name} created a page with a component that doesn't exist`;
      console.log(``);
      console.log(_chalk2.default.bold.red(_message));
      console.log(``);
      console.log(page);
      noPageOrComponent = true;
    }
  }

  if (!page.component || !path.isAbsolute(page.component)) {
    var _message2 = `${name} must set the absolute path to the page component when create creating a page`;
    // Don't log out when testing
    if (process.env.NODE_ENV !== `test`) {
      console.log(``);
      console.log(_chalk2.default.bold.red(_message2));
      console.log(``);
      console.log(page);
    } else {
      return _message2;
    }
    noPageOrComponent = true;
  }

  if (noPageOrComponent) {
    console.log(``);
    console.log(`See the documentation for createPage https://www.gatsbyjs.org/docs/bound-action-creators/#createPage`);
    console.log(``);
    process.exit(1);
  }

  var jsonName = `${_.kebabCase(page.path)}.json`;
  var internalComponentName = `Component${pascalCase(page.path)}`;

  if (jsonName === `.json`) {
    jsonName = `index.json`;
    internalComponentName = `ComponentIndex`;
  }
  var layout = page.layout || null;
  // If no layout is set we try fallback to `/src/layouts/index`.
  if (!layout && glob.sync(joinPath(store.getState().program.directory, `src/layouts/index.*`)).length) {
    layout = `index`;
  }

  var internalPage = {
    layout,
    jsonName,
    internalComponentName,
    path: page.path,
    matchPath: page.matchPath,
    component: page.component,
    componentChunkName: (0, _jsChunkNames.generateComponentChunkName)(page.component),
    // Ensure the page has a context object
    context: page.context || {},
    updatedAt: Date.now()

    // If the path doesn't have an initial forward slash, add it.
  };if (internalPage.path[0] !== `/`) {
    internalPage.path = `/${internalPage.path}`;
  }

  var result = _joi2.default.validate(internalPage, joiSchemas.pageSchema);
  if (result.error) {
    console.log(_chalk2.default.blue.bgYellow(`The upserted page didn't pass validation`));
    console.log(_chalk2.default.bold.red(result.error));
    console.log(internalPage);
    return null;
  }

  // Validate that the page component imports React and exports something
  // (hopefully a component).
  if (!internalPage.component.includes(`/.cache/`)) {
    var fileContent = fs.readFileSync(internalPage.component, `utf-8`);
    var notEmpty = true;
    var includesDefaultExport = true;

    if (fileContent === ``) {
      notEmpty = false;
    }

    if (!fileContent.includes(`export default`) && !fileContent.includes(`module.exports`) && !fileContent.includes(`exports.default`)) {
      includesDefaultExport = false;
    }
    if (!notEmpty || !includesDefaultExport) {
      var relativePath = path.relative(store.getState().program.directory, internalPage.component);

      if (!notEmpty) {
        console.log(``);
        console.log(`You have an empty file in the "src/pages" directory at "${relativePath}". Please remove it or make it a valid component`);
        console.log(``);
        // TODO actually do die during builds.
        // process.exit(1)
      }

      if (!includesDefaultExport) {
        console.log(``);
        console.log(`The page component must export a React component for it to be valid`);
        console.log(``);
      }

      // TODO actually do die during builds.
      // process.exit(1)
    }
  }

  return {
    type: `CREATE_PAGE`,
    plugin,
    traceId,
    payload: internalPage
  };
};

/**
 * Delete a layout
 * @param {string} layout a layout object with at least the name set
 * @example
 * deleteLayout(layout)
 */
actions.deleteLayout = function (layout, plugin) {
  return {
    type: `DELETE_LAYOUT`,
    payload: layout
  };
};

/**
 * Create a layout. Generally layouts are created automatically by placing a
 * React component in the `src/layouts/` directory. This action should be used
 * if loading layouts from an NPM package or from a non-standard location.
 * @param {Object} layout a layout object
 * @param {string} layout.component The absolute path to the component for this layout
 * @example
 * createLayout({
 *   component: path.resolve(`./src/templates/myNewLayout.js`),
 *   id: 'custom-id', // If no id is provided, the filename will be used as id.
 *   context: {
 *     title: `My New Layout`
 *   }
 * })
 */
actions.createLayout = function (layout, plugin, traceId) {
  var id = layout.id || path.parse(layout.component).name;
  // Add a "machine" id as a universal ID to differentiate layout from
  // page components.
  var machineId = `layout---${id}`;
  var componentWrapperPath = joinPath(store.getState().program.directory, `.cache`, `layouts`, `${id}.js`);

  var internalLayout = {
    id,
    machineId,
    componentWrapperPath,
    isLayout: true,
    jsonName: `layout-${_.kebabCase(id)}.json`,
    internalComponentName: `Component-layout-${pascalCase(id)}`,
    component: layout.component,
    componentChunkName: (0, _jsChunkNames.generateComponentChunkName)(layout.component),
    // Ensure the page has a context object
    context: layout.context || {}
  };

  var result = _joi2.default.validate(internalLayout, joiSchemas.layoutSchema);

  if (result.error) {
    console.log(_chalk2.default.blue.bgYellow(`The upserted layout didn't pass validation`));
    console.log(_chalk2.default.bold.red(result.error));
    console.log(internalLayout);
    return null;
  }

  return {
    type: `CREATE_LAYOUT`,
    plugin,
    traceId,
    payload: internalLayout
  };
};

/**
 * Delete a node
 * @param {string} nodeId a node id
 * @param {object} node the node object
 * @example
 * deleteNode(node.id, node)
 */
actions.deleteNode = function (nodeId, node, plugin) {
  var deleteDescendantsActions = void 0;
  // It's possible the file node was never created as sometimes tools will
  // write and then immediately delete temporary files to the file system.
  if (node) {
    // Also delete any nodes transformed from this one.
    var descendantNodes = findChildrenRecursively(node.children);
    if (descendantNodes.length > 0) {
      deleteDescendantsActions = descendantNodes.map(function (n) {
        return actions.deleteNode(n, getNode(n), plugin);
      });
    }
  }

  var deleteAction = {
    type: `DELETE_NODE`,
    plugin,
    node,
    payload: nodeId
  };

  if (deleteDescendantsActions) {
    return [].concat(deleteDescendantsActions, [deleteAction]);
  } else {
    return deleteAction;
  }
};

/**
 * Batch delete nodes
 * @param {Array} nodes an array of node ids
 * @example
 * deleteNodes([`node1`, `node2`])
 */
actions.deleteNodes = function (nodes, plugin) {
  // Also delete any nodes transformed from these.
  var descendantNodes = _.flatten(nodes.map(function (n) {
    return findChildrenRecursively(getNode(n).children);
  }));
  var deleteDescendantsActions = void 0;
  if (descendantNodes.length > 0) {
    deleteDescendantsActions = descendantNodes.map(function (n) {
      return actions.deleteNode(n, getNode(n), plugin);
    });
  }

  var deleteNodesAction = {
    type: `DELETE_NODES`,
    plugin,
    payload: nodes
  };

  if (deleteDescendantsActions) {
    return [].concat(deleteDescendantsActions, [deleteNodesAction]);
  } else {
    return deleteNodesAction;
  }
};

var typeOwners = {};
/**
 * Create a new node.
 * @param {Object} node a node object
 * @param {string} node.id The node's ID. Must be globally unique.
 * @param {string} node.parent The ID of the parent's node. If the node is
 * derived from another node, set that node as the parent. Otherwise it can
 * just be `null`.
 * @param {Array} node.children An array of children node IDs. If you're
 * creating the children nodes while creating the parent node, add the
 * children node IDs here directly. If you're adding a child node to a
 * parent node created by a plugin, you can't mutate this value directly
 * to add your node id, instead use the action creator `createParentChildLink`.
 * @param {Object} node.internal node fields that aren't generally
 * interesting to consumers of node data but are very useful for plugin writers
 * and Gatsby core.
 * @param {string} node.internal.mediaType An optional field to indicate to
 * transformer plugins that your node has raw content they can transform.
 * Use either an official media type (we use mime-db as our source
 * (https://www.npmjs.com/package/mime-db) or a made-up one if your data
 * doesn't fit in any existing bucket. Transformer plugins use node media types
 * for deciding if they should transform a node into a new one. E.g.
 * markdown transformers look for media types of
 * `text/markdown`.
 * @param {string} node.internal.type An arbitrary globally unique type
 * choosen by the plugin creating the node. Should be descriptive of the
 * node as the type is used in forming GraphQL types so users will query
 * for nodes based on the type choosen here. Nodes of a given type can
 * only be created by one plugin.
 * @param {string} node.internal.content An optional field. The raw content
 * of the node. Can be excluded if it'd require a lot of memory to load in
 * which case you must define a `loadNodeContent` function for this node.
 * @param {string} node.internal.contentDigest the digest for the content
 * of this node. Helps Gatsby avoid doing extra work on data that hasn't
 * changed.
 * @param {string} node.internal.description An optional field. Human
 * readable description of what this node represent / its source. It will
 * be displayed when type conflicts are found, making it easier to find
 * and correct type conflicts.
 * @example
 * createNode({
 *   // Data for the node.
 *   field1: `a string`,
 *   field2: 10,
 *   field3: true,
 *   ...arbitraryOtherData,
 *
 *   // Required fields.
 *   id: `a-node-id`,
 *   parent: `the-id-of-the-parent-node`, // or null if it's a source node without a parent
 *   children: [],
 *   internal: {
 *     type: `CoolServiceMarkdownField`,
 *     contentDigest: crypto
 *       .createHash(`md5`)
 *       .update(JSON.stringify(fieldData))
 *       .digest(`hex`),
 *     mediaType: `text/markdown`, // optional
 *     content: JSON.stringify(fieldData), // optional
 *     description: `Cool Service: "Title of entry"`, // optional
 *   }
 * })
 */
actions.createNode = function (node, plugin, traceId) {
  if (!_.isObject(node)) {
    return console.log(_chalk2.default.bold.red(`The node passed to the "createNode" action creator must be an object`));
  }

  // Ensure the new node has an internals object.
  if (!node.internal) {
    node.internal = {};
  }

  // Tell user not to set the owner name themself.
  if (node.internal.owner) {
    console.log(JSON.stringify(node, null, 4));
    console.log(_chalk2.default.bold.red(`The node internal.owner field is set automatically by Gatsby and not by plugin`));
    process.exit(1);
  }

  // Add the plugin name to the internal object.
  if (plugin) {
    node.internal.owner = plugin.name;
  }

  var result = _joi2.default.validate(node, joiSchemas.nodeSchema);
  if (result.error) {
    console.log(_chalk2.default.bold.red(`The new node didn't pass validation`));
    console.log(_chalk2.default.bold.red(result.error));
    console.log(node);
    return { type: `VALIDATION_ERROR`, error: true };
  }

  // Ensure node isn't directly setting fields.
  if (node.fields) {
    throw new Error(stripIndent`
      Plugins creating nodes can not set data on the reserved field "fields"
      as this is reserved for plugins which wish to extend your nodes.

      If your plugin didn't add "fields" you're probably seeing this
      error because you're reusing an old node object.

      Node:

      ${JSON.stringify(node, null, 4)}

      Plugin that created the node:

      ${JSON.stringify(plugin, null, 4)}
    `);
  }

  trackInlineObjectsInRootNode(node);

  var oldNode = getNode(node.id);

  // Ensure the plugin isn't creating a node type owned by another
  // plugin. Type "ownership" is first come first served.
  if (plugin) {
    var pluginName = plugin.name;

    if (!typeOwners[node.internal.type]) typeOwners[node.internal.type] = pluginName;else if (typeOwners[node.internal.type] !== pluginName) throw new Error(stripIndent`
        The plugin "${pluginName}" created a node of a type owned by another plugin.

        The node type "${node.internal.type}" is owned by "${typeOwners[node.internal.type]}".

        If you copy and pasted code from elsewhere, you'll need to pick a new type name
        for your new node(s).

        The node object passed to "createNode":

        ${JSON.stringify(node, null, 4)}

        The plugin creating the node:

        ${JSON.stringify(plugin, null, 4)}
      `);

    // If the node has been created in the past, check that
    // the current plugin is the same as the previous.
    if (oldNode && oldNode.internal.owner !== pluginName) {
      throw new Error(stripIndent`
        Nodes can only be updated by their owner. Node "${node.id}" is
        owned by "${oldNode.internal.owner}" and another plugin "${pluginName}"
        tried to update it.

        `);
    }
  }

  var deleteAction = void 0;
  var updateNodeAction = void 0;
  // Check if the node has already been processed.
  if (oldNode && !hasNodeChanged(node.id, node.internal.contentDigest)) {
    updateNodeAction = {
      type: `TOUCH_NODE`,
      plugin,
      traceId,
      payload: node.id
    };
  } else {
    // Remove any previously created descendant nodes as they're all due
    // to be recreated.
    if (oldNode) {
      var descendantNodes = findChildrenRecursively(oldNode.children);
      if (descendantNodes.length > 0) {
        deleteAction = actions.deleteNodes(descendantNodes);
      }
    }

    updateNodeAction = {
      type: `CREATE_NODE`,
      plugin,
      traceId,
      payload: node
    };
  }

  if (deleteAction) {
    return [deleteAction, updateNodeAction];
  } else {
    return updateNodeAction;
  }
};

/**
 * "Touch" a node. Tells Gatsby a node still exists and shouldn't
 * be garbage collected. Primarily useful for source plugins fetching
 * nodes from a remote system that can return only nodes that have
 * updated. The source plugin then touches all the nodes that haven't
 * updated but still exist so Gatsby knows to keep them.
 * @param {string} nodeId The id of a node.
 * @example
 * touchNode(`a-node-id`)
 */
actions.touchNode = function (nodeId, plugin) {
  return {
    type: `TOUCH_NODE`,
    plugin,
    payload: nodeId
  };
};

/**
 * Extend another node. The new node field is placed under the `fields`
 * key on the extended node object.
 *
 * Once a plugin has claimed a field name the field name can't be used by
 * other plugins.  Also since nodes are immutable, you can't mutate the node
 * directly. So to extend another node, use this.
 * @param {Object} $0
 * @param {Object} $0.node the target node object
 * @param {string} $0.fieldName [deprecated] the name for the field
 * @param {string} $0.fieldValue [deprecated] the value for the field
 * @param {string} $0.name the name for the field
 * @param {string} $0.value the value for the field
 * @example
 * createNodeField({
 *   node,
 *   name: `happiness`,
 *   value: `is sweet graphql queries`
 * })
 *
 * // The field value is now accessible at node.fields.happiness
 */
actions.createNodeField = function (_ref, plugin, traceId) {
  var node = _ref.node,
      name = _ref.name,
      value = _ref.value,
      fieldName = _ref.fieldName,
      fieldValue = _ref.fieldValue;

  if (fieldName) {
    console.warn(`Calling "createNodeField" with "fieldName" is deprecated. Use "name" instead`);
    if (!name) {
      name = fieldName;
    }
  }
  if (fieldValue) {
    console.warn(`Calling "createNodeField" with "fieldValue" is deprecated. Use "value" instead`);
    if (!value) {
      value = fieldValue;
    }
  }
  // Ensure required fields are set.
  if (!node.internal.fieldOwners) {
    node.internal.fieldOwners = {};
  }
  if (!node.fields) {
    node.fields = {};
  }

  /**
   * Normalized name of the field that will be used in schema
   */
  var schemaFieldName = _.includes(name, `___NODE`) ? name.split(`___`)[0] : name;

  // Check that this field isn't owned by another plugin.
  var fieldOwner = node.internal.fieldOwners[schemaFieldName];
  if (fieldOwner && fieldOwner !== plugin.name) {
    throw new Error(stripIndent`
      A plugin tried to update a node field that it doesn't own:

      Node id: ${node.id}
      Plugin: ${plugin.name}
      name: ${name}
      value: ${value}
      `);
  }

  // Update node
  node.fields[name] = value;
  node.internal.fieldOwners[schemaFieldName] = plugin.name;

  return {
    type: `ADD_FIELD_TO_NODE`,
    plugin,
    traceId,
    payload: node
  };
};

/**
 * Creates a link between a parent and child node. This is used when you
 * transform content from a node creating a new child node. You need to add
 * this new child node to the `children` array of the parent but since you
 * don't have direct access to the immutable parent node, use this action
 * instead.
 * @param {Object} $0
 * @param {Object} $0.parent the parent node object
 * @param {Object} $0.child the child node object
 * @example
 * createParentChildLink({ parent: parentNode, child: childNode })
 */
actions.createParentChildLink = function (_ref2, plugin) {
  var parent = _ref2.parent,
      child = _ref2.child;

  // Update parent
  parent.children.push(child.id);
  parent.children = _.uniq(parent.children);

  return {
    type: `ADD_CHILD_NODE_TO_PARENT_NODE`,
    plugin,
    payload: parent
  };
};

/**
 * Create a dependency between a page and data. Probably for
 * internal use only.
 * @param {Object} $0
 * @param {string} $0.path the path to the page
 * @param {string} $0.nodeId A node ID
 * @param {string} $0.connection A connection type
 * @private
 */
actions.createPageDependency = function (_ref3) {
  var path = _ref3.path,
      nodeId = _ref3.nodeId,
      connection = _ref3.connection;
  var plugin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ``;

  return {
    type: `CREATE_COMPONENT_DEPENDENCY`,
    plugin,
    payload: {
      path,
      nodeId,
      connection
    }
  };
};

/**
 * Delete dependencies between an array of pages and data. Probably for
 * internal use only. Used when deleting pages.
 * @param {Array} paths the paths to delete.
 * @private
 */
actions.deleteComponentsDependencies = function (paths) {
  return {
    type: `DELETE_COMPONENTS_DEPENDENCIES`,
    payload: {
      paths
    }
  };
};

/**
 * When the query watcher extracts a graphq query, it calls
 * this to store the query with its component.
 * @private
 */
actions.replaceComponentQuery = function (_ref4) {
  var query = _ref4.query,
      componentPath = _ref4.componentPath;

  return {
    type: `REPLACE_COMPONENT_QUERY`,
    payload: {
      query,
      componentPath
    }
  };
};

/**
 * Create a "job". This is a long-running process that are generally
 * started as side-effects to GraphQL queries.
 * [`gatsby-plugin-sharp`](/packages/gatsby-plugin-sharp/) uses this for
 * example.
 *
 * Gatsby doesn't finish its bootstrap until all jobs are ended.
 * @param {Object} job A job object with at least an id set
 * @param {id} job.id The id of the job
 * @example
 * createJob({ id: `write file id: 123`, fileName: `something.jpeg` })
 */
actions.createJob = function (job) {
  var plugin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return {
    type: `CREATE_JOB`,
    plugin,
    payload: job
  };
};

/**
 * Set (update) a "job". Sometimes on really long running jobs you want
 * to update the job as it continues.
 *
 * @param {Object} job A job object with at least an id set
 * @param {id} job.id The id of the job
 * @example
 * setJob({ id: `write file id: 123`, progress: 50 })
 */
actions.setJob = function (job) {
  var plugin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return {
    type: `SET_JOB`,
    plugin,
    payload: job
  };
};

/**
 * End a "job".
 *
 * Gatsby doesn't finish its bootstrap until all jobs are ended.
 * @param {Object} job  A job object with at least an id set
 * @param {id} job.id The id of the job
 * @example
 * endJob({ id: `write file id: 123` })
 */
actions.endJob = function (job) {
  var plugin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return {
    type: `END_JOB`,
    plugin,
    payload: job
  };
};

/**
 * Set plugin status. A plugin can use this to save status keys e.g. the last
 * it fetched something. These values are persisted between runs of Gatsby.
 *
 * @param {Object} status  An object with arbitrary values set
 * @example
 * setPluginStatus({ lastFetched: Date.now() })
 */
actions.setPluginStatus = function (status, plugin) {
  return {
    type: `SET_PLUGIN_STATUS`,
    plugin,
    payload: status
  };
};

/**
 * Create a redirect from one page to another. Server redirects don't work out
 * of the box. You must have a plugin setup to integrate the redirect data with
 * your hosting technology e.g. the [Netlify
 * plugin](/packages/gatsby-plugin-netlify/)).
 *
 * @param {Object} redirect Redirect data
 * @param {string} redirect.fromPath Any valid URL. Must start with a forward slash
 * @param {boolean} redirect.isPermanent This is a permanent redirect; defaults to temporary
 * @param {string} redirect.toPath URL of a created page (see `createPage`)
 * @param {boolean} redirect.redirectInBrowser Redirects are generally for redirecting legacy URLs to their new configuration. If you can't update your UI for some reason, set `redirectInBrowser` to true and Gatsby will handle redirecting in the client as well.
 * @example
 * createRedirect({ fromPath: '/old-url', toPath: '/new-url', isPermanent: true })
 * createRedirect({ fromPath: '/url', toPath: '/zn-CH/url', Language: 'zn' })
 */
actions.createRedirect = function (_ref5) {
  var fromPath = _ref5.fromPath,
      _ref5$isPermanent = _ref5.isPermanent,
      isPermanent = _ref5$isPermanent === undefined ? false : _ref5$isPermanent,
      _ref5$redirectInBrows = _ref5.redirectInBrowser,
      redirectInBrowser = _ref5$redirectInBrows === undefined ? false : _ref5$redirectInBrows,
      toPath = _ref5.toPath,
      rest = (0, _objectWithoutProperties3.default)(_ref5, ["fromPath", "isPermanent", "redirectInBrowser", "toPath"]);

  var pathPrefix = ``;
  if (store.getState().program.prefixPaths) {
    pathPrefix = store.getState().config.pathPrefix;
  }

  return {
    type: `CREATE_REDIRECT`,
    payload: (0, _extends3.default)({
      fromPath: `${pathPrefix}${fromPath}`,
      isPermanent,
      redirectInBrowser,
      toPath: `${pathPrefix}${toPath}`
    }, rest)
  };
};

/**
 * All defined actions.
 */
exports.actions = actions;

/**
 * All action creators wrapped with a dispatch.
 */
exports.boundActionCreators = bindActionCreators(actions, store.dispatch);
//# sourceMappingURL=actions.js.map