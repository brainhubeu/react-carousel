# PostCSS Browser Reporter [![Build Status](https://travis-ci.org/postcss/postcss-browser-reporter.svg)](https://travis-ci.org/postcss/postcss-browser-reporter)

> [PostCSS] plugin to report warning messages right in your browser.

If a plugin before this one is throwning a warning, this plugin will append warning messages to `html:before`.

![Postcss-browser-reporter – warnings from other postcss plugins in your browser](http://postcss.github.io/postcss-browser-reporter/screenshot.png)

## Usage

Put this plugin after all plugins if you want to cover all possible warnings:

```js
postcss([
  require('other-plugin'),
  require('postcss-browser-reporter')
])
```

### Options

#### `selector` (`{String}`, default: `html::before`)

You can override selector that will be used to display messages:

```js
var messages = require('postcss-browser-reporter')
postcss([
  messages({
    selector: 'body:before'
  })
])
```

#### `styles` (`{Object}`, default: opinionated styles)

You can override default styles applied to the selector:

```js
var messages = require('postcss-browser-reporter')
postcss([
  messages({
    styles: {
      color: 'gray',
      'text-align': 'center'
    }
  })
])
```

See [PostCSS] docs for examples for your environment.

## License

The MIT License

[PostCSS]: https://github.com/postcss/postcss
