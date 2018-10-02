# eslint-config-brainhub

> ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for the Brainhub JavaScript style guide

[![CircleCI](https://circleci.com/gh/adam-golab/eslint-config-brainhub.svg?style=svg)](https://circleci.com/gh/adam-golab/eslint-config-brainhub)
[![Greenkeeper badge](https://badges.greenkeeper.io/adam-golab/eslint-config-brainhub.svg)](https://greenkeeper.io/)

## Installation

```
$ npm install --save-dev eslint eslint-config-brainhub
```


## Usage

Once the `eslint-config-brainhub` package is installed, you can use it by specifying `brainhub` in the [`extends`](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) section of your [ESLint configuration](http://eslint.org/docs/user-guide/configuring) (Usually `.eslintrc` file in main directory).

```js
{
  "extends": "brainhub",
  "rules": {
    // Additional, per-project rules...
  }
}
```

## Rules

See [RULES.md](RULES.md) file

## License

Apache-2 © Brainhub
