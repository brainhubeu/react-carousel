# rn-host-detect

> Get correctly `localhost` on Android emulator for React Native

On Android emulator, if you want to connect any servers of local, you will need run `adb reverse` on your terminal. This module made it easier, you can get the localhost IP of host machine directly (`10.0.2.2`, Genymotion: `10.0.3.2`).

This was done in the following projects:

* [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools/blob/fbb169173c235eceb136a02a52c6f36b64297910/src/utils/reactNative.js)
* [reactotron-react-native](https://github.com/infinitered/reactotron/blob/f5de09955b870a90cc772bf6c5139ef8e3ecbbba/packages/reactotron-react-native/src/get-host.js)

That's why you don't need `adb reverse` when you're using these modules on Android emulator.

## Installation

```bash
$ npm i rn-host-detect --save-dev
```

## Usage

```js
const getHostForRN = require('rn-host-detect')

// '10.0.2.2' or '10.0.3.2' on Android
getHostForRN('localhost')

// '192.168.1.111', only convert localhost (or 127.0.0.1) to host IP
getHostForRN('192.168.1.111')
```

## License

[MIT](LICENSE.md)
