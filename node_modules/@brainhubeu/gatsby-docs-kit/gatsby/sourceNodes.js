'use strict';

const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const chokidar = require(`chokidar`);
const JSON5Parser = require('json5').parse;
const yamlParser = require('js-yaml').safeLoad;

const { attachUrlToNavNode } = require('../utils/navigation/attach-url');
const { attachMarkdownFilePath } = require('../utils/navigation/attach-file-paths');

const CONFIG_LOADER = {
  'text/yaml': yamlParser,
  'application/json': JSON5Parser,
};


const createMenuConfigNode = configFilePath => {
  const configMimeType = mime.lookup(configFilePath);

  const configLoader = CONFIG_LOADER[configMimeType];

  if (!configLoader) {
    throw new Error(`Unsupported config mime type: ${configMimeType}`);
  }

  const fileContent = fs.readFileSync(configFilePath, 'utf8');

  const parsedConfig = configLoader(fileContent);

  // TODO add config validation here

  const enhancedConfig = attachUrlToNavNode(attachMarkdownFilePath(parsedConfig, path.parse(configFilePath).dir));

  // we need to create Menu empty blueprint to be able to add node types in setFieldsOnGraphQlNodeType.js
  return {
    id: 'Menu Config >> Gatsby Docs Kit',
    children: [],
    parent: 'MENU',
    internal: {
      type: 'Menu',
      contentDigest: JSON.stringify(enhancedConfig),
    },
    pages: enhancedConfig,
  };
};


module.exports = ({ boundActionCreators }, options = {}) => {
  if (!options.config) {
    throw new Error('Config path is required!');
  }

  const { createNode } = boundActionCreators;

  // watch for changes in config file
  chokidar.watch(options.config)
    .on('add', configPath => createNode(createMenuConfigNode(configPath)))
    .on('change', configPath => createNode(createMenuConfigNode(configPath)))
    .on('unlink', configPath => {
      throw new Error(`Config file at: ${configPath} has been deleted. Config file is required`);
    });
};
