# webpack-validator

 > Validate your webpack configs with joi

[![travis build](https://img.shields.io/travis/js-dxtools/webpack-validator.svg?style=flat-square)](https://travis-ci.org/js-dxtools/webpack-validator)
[![codecov.io](https://img.shields.io/codecov/c/github/js-dxtools/webpack-validator.svg?style=flat-square)](https://codecov.io/github/js-dxtools/webpack-validator?branch=master)
![dependencies](https://img.shields.io/david/js-dxtools/webpack-validator.svg?style=flat-square)
![devDependencies](https://img.shields.io/david/dev/js-dxtools/webpack-validator.svg?style=flat-square)
[![version](https://img.shields.io/npm/v/webpack-validator.svg?style=flat-square)](http://npm.im/webpack-validator)
[![downloads](https://img.shields.io/npm/dm/webpack-validator.svg?style=flat-square)](http://npm-stat.com/charts.html?package=webpack-validator&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/webpack-validator.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

Writing webpack configs is brittle and error-prone. This package provides a [joi](https://github.com/hapijs/joi) object schema for webpack configs. This gets you a) static type safety, b) property spell checking and c) semantic validations such as "`loader` and `loaders` can not be used simultaneously" or "`query` can only be used with `loader`, not with `loaders`".

You're very welcome to give [feedback](https://github.com/js-dxtools/webpack-validator/issues) & [PR's](https://github.com/js-dxtools/webpack-validator).

**Note: webpack v2 has built-in validation for configuration. Due to this, `webpack-validator` is unlikely to make significant changes. While pull requests will be reviewed and can be merged, project maintainers are unlikely to put a lot of much effort into the maintenance of the project.**

### Example
Take this simple webpack config. It has a tiny, hard to spot error. Can you find it?
```js
var config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Redux',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};
```

webpack-validator makes it easy:

![validation-example](https://cloud.githubusercontent.com/assets/3755413/14134087/b3279738-f654-11e5-9752-367b01ac123d.png)

### Usage
There are two ways to use webpack-validator: a) "programmatically" by wrapping your webpack config object with a validation function or b) by using a command line interface.

For the first approach, add this in your `webpack.config.js`:
```js
const validate = require('webpack-validator');

module.exports = validate({ /* ... your webpack config */ });
```
Now run webpack. Either everything is green and the build continues or `joi` will let you know what's wrong and the build won't continue.

If your webpack config is an array of configs instead of a single object, the above doesn't quite work. Add this in your `webpack.config.js` instead:
```js
const validate = require('webpack-validator').validateRoot;

module.exports = validate({ /* ... your webpack config */ });
```

#### CLI
For CLI usage you probably want to install the tool globally (`npm install -g webpack-validator`) first. Then just run `webpack-validator <your-config>`.

### Customizing
#### Schema
If you need to extend the schema, for example for custom top level properties or properties added by third party plugins like `eslint-loader` (which adds a toplevel `eslint` property), do it like this:

```js
const validate = require('webpack-validator')
const Joi = require('webpack-validator').Joi

// This joi schema will be `Joi.concat`-ed with the internal schema
const yourSchemaExtension = Joi.object({
  // this would just allow the property and doesn't perform any additional validation
  eslint: Joi.any()
})

const config = { /* ... your webpack config */ }

module.exports = validate(config, { schemaExtension: yourSchemaExtension })
```

#### Rules
Some validations do more than just validating your data shape, they check for best practices and do "more" which you might want to opt out of / in to. This is an overview of the available rules (we just started with this, this list will grow :)):
- **no-root-files-node-modules-nameclash** (default: true): this checks that files/folders that are found in directories specified via webpacks `resolve.root` option do not nameclash with `node_modules` packages. This prevents nasty path resolving bugs (for a motivating example, have a look at [this redux issue](https://github.com/reactjs/redux/issues/1681)).
- **loader-enforce-include-or-exclude** (default: false): enforce that [loader](https://webpack.github.io/docs/configuration.html#module-loaders) objects use `include` or/and `exclude`, throw when neither is supplied. Without supplying one of these conditions it is too easy to process too many files, for example your `node_modules` folder.
- **loader-prefer-include** (default: false): enforce that [loader](https://webpack.github.io/docs/configuration.html#module-loaders) objects use `include` and not `exclude`. `exclude` makes it easy to match too many files, which might inadvertently slow your build down.

You opt in/out of rules by using the `rules` option:
```js
module.exports = validate(config, {
  rules: {
    'no-root-files-node-modules-nameclash': false,
  },
})
```

**Note**: This is not yet implemented via cli options, the default rules will apply in that case.

#### Quiet Mode
If you want to mute console output apart from errors, set `--quiet` (`-q`) or `validate(config, { quiet: true })`. This is particularly useful if you are using webpack `--json` as you'll want to avoid writing additional text to the JSON output.

#### Validate all **package.json** `scripts`
It is possible to use the CLI to validate all your **package.json** `scripts` related configurations at once by using `--all-scripts` (`-a`). The system will try to guess the convention you are using and then executes validation against each script target based on that.

#### Advanced Usage
If you need to access the validation results directly and want to control the side-effects (i.e. console.log output, `process.exit(1)` on fail behaviour) yourself, you can call the validation function like so: `validate(config, { returnValidation: true })`. This will make 1) the function return the validation results instead of your configuration and 2) not perform any side effects.

#### Support
Because this module uses the amazing `Joi` validation library, this module only supports Node >=4.0.0.

#### License
MIT
