# Font Awesome icons as React components

## Installation

React Font Awesome is distributed via [npm][]:

```bash
npm install react react-fa
```

You also need to install [webpack][] which is the only bundler at the moment
capable to bundle not only JavaScript code but also stylesheets and static
assets such as fonts and images:

```bash
npm install webpack
```

You also need a couple of loaders for webpack:

```bash
npm install babel-loader style-loader css-loader url-loader file-loader
npm install extract-text-webpack-plugin
```

## Usage

Just as simple as:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import {Icon} from 'react-fa'

ReactDOM.renderComponent(
  <Icon spin name="spinner" />,
  document.getElementById('main')
)
```

### Icon Component API

**Props in `[]` are optional**

|Prop       |Type    |Default    |Description                                 |
|-----------|:------:|:---------:|--------------------------------------------|
|name       |`string`|`undefined`|Required: Name of the Font Awesome Icon     |
|[className]|`string`|`undefined`|Set a CSS class for extra styles            |
|[size]     |`string`|`undefined`|Increase size: 'lg', '2x', '3x', '4x', '5x' |
|[rotate]   |`string`|`undefined`|Rotate by deg: '45', '90', '135', '180', '225', '270', '315'|
|[flip]     |`string`|`undefined`|Flips Icon: 'horizontal', 'vertical'        |
|[fixedWidth]|`boolean`|`false`|Set Icon to a fixed width                   |
|[spin]     |`boolean`| `false`|Rotate Icon|
|[pulse]     |`boolean`|`false`|Rotate Icon in 8 steps|
|[stack]     |`string` |`undefined`|Stack Icons: '1x', '2x'. [More Info][]
|[inverse]   |`boolean`|`false`|Inverse the Icon color|
|[Component] |`string/func`|`span`|Alternate DOM element |

### IconStack Component API

|Prop       |Type    |Default    |Description                                 |
|-----------|:------:|:---------:|--------------------------------------------|
|[children] |`node`|`undefined`|Required: Child elements |
|[size]     |`string`|`undefined`|Increase size: 'lg', '2x', '3x', '4x', '5x' |
|[className]|`string`|`undefined`|Set a CSS class for extra styles            |

## Webpack Setup

Use the following webpack config (put it in `webpack.config.js`):

```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: 'assets',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
}
```

which compile everything (js, stylesheets and icon fonts) into `assets/`
directory so you would need this basic HTML file to start your app:

```html
<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="assets/bundle.css">
    </head>
    <body>
        <div id="main"></div>
        <script src="assets/bundle.js"></script>
    </body>
</html>
```

Note: If you run into issues with loading the FontAwesome font when *not* using `ExtractTextPlugin`, this might be fixed by making your `publicPath` absolute. See [this StackOverflow question](http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809) for details.

[webpack]: http://webpack.github.io/
[npm]: http://npmjs.org
[More Info]: http://fontawesome.io/examples/ 'Scroll to stacked icons'
