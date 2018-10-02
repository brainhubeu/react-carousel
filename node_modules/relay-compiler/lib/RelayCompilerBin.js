/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayCompilerBin
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

let run = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (options) {
    var schemaPath = require('path').resolve(process.cwd(), options.schema);
    if (!require('fs').existsSync(schemaPath)) {
      throw new Error('--schema path does not exist: ' + schemaPath + '.');
    }
    var srcDir = require('path').resolve(process.cwd(), options.src);
    if (!require('fs').existsSync(srcDir)) {
      throw new Error('--source path does not exist: ' + srcDir + '.');
    }
    if (options.watch && !options.watchman) {
      throw new Error('Watchman is required to watch for changes.');
    }
    if (options.watch && !hasWatchmanRootFile(srcDir)) {
      throw new Error(('\n--watch requires that the src directory have a valid watchman "root" file.\n\nRoot files can include:\n- A .git/ Git folder\n- A .hg/ Mercurial folder\n- A .watchmanconfig file\n\nEnsure that one such file exists in ' + srcDir + ' or its parents.\n    ').trim());
    }

    var reporter = new ConsoleReporter({ verbose: options.verbose });

    var useWatchman = options.watchman && (yield WatchmanClient.isAvailable());

    var parserConfigs = {
      'default': {
        baseDir: srcDir,
        getFileFilter: require('./RelayJSModuleParser').getFileFilter,
        getParser: require('./RelayJSModuleParser').getParser,
        getSchema: function getSchema() {
          return _getSchema(schemaPath);
        },
        watchmanExpression: useWatchman ? buildWatchExpression(options) : null,
        filepaths: useWatchman ? null : getFilepathsFromGlob(srcDir, options)
      }
    };
    var writerConfigs = {
      'default': {
        getWriter: getRelayFileWriter(srcDir),
        isGeneratedFile: function isGeneratedFile(filePath) {
          return filePath.endsWith('.js') && filePath.includes('__generated__');
        },
        parser: 'default'
      }
    };
    var codegenRunner = new CodegenRunner({
      reporter: reporter,
      parserConfigs: parserConfigs,
      writerConfigs: writerConfigs,
      onlyValidate: options.validate
    });
    if (!options.validate && !options.watch && options.watchman) {
      // eslint-disable-next-line no-console
      console.log('HINT: pass --watch to keep watching for changes.');
    }
    var result = options.watch ? yield codegenRunner.watchAll() : yield codegenRunner.compileAll();

    if (result === 'ERROR') {
      process.exit(100);
    }
    if (options.validate && result !== 'NO_CHANGES') {
      process.exit(101);
    }
  });

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-polyfill');

var _require = require('./GraphQLCompilerPublic'),
    CodegenRunner = _require.CodegenRunner,
    ConsoleReporter = _require.ConsoleReporter,
    WatchmanClient = _require.WatchmanClient;

var _require2 = require('graphql'),
    buildASTSchema = _require2.buildASTSchema,
    buildClientSchema = _require2.buildClientSchema,
    parse = _require2.parse,
    printSchema = _require2.printSchema;

var codegenTransforms = require('./RelayIRTransforms').codegenTransforms,
    fragmentTransforms = require('./RelayIRTransforms').fragmentTransforms,
    printTransforms = require('./RelayIRTransforms').printTransforms,
    queryTransforms = require('./RelayIRTransforms').queryTransforms,
    schemaExtensions = require('./RelayIRTransforms').schemaExtensions;

function buildWatchExpression(options) {
  return ['allof', ['type', 'f'], ['anyof'].concat((0, _toConsumableArray3['default'])(options.extensions.map(function (ext) {
    return ['suffix', ext];
  }))), ['anyof'].concat((0, _toConsumableArray3['default'])(options.include.map(function (include) {
    return ['match', include, 'wholename'];
  })))].concat((0, _toConsumableArray3['default'])(options.exclude.map(function (exclude) {
    return ['not', ['match', exclude, 'wholename']];
  })));
}

function getFilepathsFromGlob(baseDir, options) {
  var extensions = options.extensions,
      include = options.include,
      exclude = options.exclude;

  var patterns = include.map(function (inc) {
    return inc + '/*.+(' + extensions.join('|') + ')';
  });

  // $FlowFixMe(site=react_native_fb,www)
  var glob = require('fast-glob');
  return glob.sync(patterns, {
    cwd: baseDir,
    bashNative: [],
    onlyFiles: true,
    ignore: exclude
  });
}

function getRelayFileWriter(baseDir) {
  return function (onlyValidate, schema, documents, baseDocuments) {
    return new (require('./RelayFileWriter'))({
      config: {
        formatModule: require('./formatGeneratedModule'),
        compilerTransforms: {
          codegenTransforms: codegenTransforms,
          fragmentTransforms: fragmentTransforms,
          printTransforms: printTransforms,
          queryTransforms: queryTransforms
        },
        baseDir: baseDir,
        schemaExtensions: schemaExtensions
      },
      onlyValidate: onlyValidate,
      schema: schema,
      baseDocuments: baseDocuments,
      documents: documents
    });
  };
}

function _getSchema(schemaPath) {
  try {
    var source = require('fs').readFileSync(schemaPath, 'utf8');
    if (require('path').extname(schemaPath) === '.json') {
      source = printSchema(buildClientSchema(JSON.parse(source).data));
    }
    source = '\n  directive @include(if: Boolean) on FRAGMENT | FIELD\n  directive @skip(if: Boolean) on FRAGMENT | FIELD\n\n  ' + source + '\n  ';
    return buildASTSchema(parse(source));
  } catch (error) {
    throw new Error(('\nError loading schema. Expected the schema to be a .graphql or a .json\nfile, describing your GraphQL server\'s API. Error detail:\n\n' + error.stack + '\n    ').trim());
  }
}

// Ensure that a watchman "root" file exists in the given directory
// or a parent so that it can be watched
var WATCHMAN_ROOT_FILES = ['.git', '.hg', '.watchmanconfig'];
function hasWatchmanRootFile(testPath) {
  while (require('path').dirname(testPath) !== testPath) {
    if (WATCHMAN_ROOT_FILES.some(function (file) {
      return require('fs').existsSync(require('path').join(testPath, file));
    })) {
      return true;
    }
    testPath = require('path').dirname(testPath);
  }
  return false;
}

// Collect args
var argv = require('yargs').usage('Create Relay generated files\n\n' + '$0 --schema <path> --src <path> [--watch]').options({
  schema: {
    describe: 'Path to schema.graphql or schema.json',
    demandOption: true,
    type: 'string'
  },
  src: {
    describe: 'Root directory of application code',
    demandOption: true,
    type: 'string'
  },
  include: {
    array: true,
    'default': ['**'],
    describe: 'Directories to include under src',
    type: 'string'
  },
  exclude: {
    array: true,
    'default': ['**/node_modules/**', '**/__mocks__/**', '**/__tests__/**', '**/__generated__/**'],
    describe: 'Directories to ignore under src',
    type: 'string'
  },
  extensions: {
    array: true,
    'default': ['js'],
    describe: 'File extensions to compile (--extensions js jsx)',
    type: 'string'
  },
  verbose: {
    describe: 'More verbose logging',
    type: 'boolean'
  },
  watchman: {
    describe: 'Use watchman when not in watch mode',
    type: 'boolean',
    'default': true
  },
  watch: {
    describe: 'If specified, watches files and regenerates on changes',
    type: 'boolean'
  },
  validate: {
    describe: 'Looks for pending changes and exits with non-zero code instead of ' + 'writing to disk',
    type: 'boolean',
    'default': false
  }
}).help().argv;

// Run script with args
// $FlowFixMe: Invalid types for yargs. Please fix this when touching this code.
run(argv)['catch'](function (error) {
  console.error(String(error.stack || error));
  process.exit(1);
});