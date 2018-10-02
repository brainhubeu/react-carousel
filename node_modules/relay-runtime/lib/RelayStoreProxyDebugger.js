/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayStoreProxyDebugger
 * 
 * @format
 */

'use strict';

function dump(proxy) {
  if (proxy instanceof require('./RelayRecordSourceSelectorProxy')) {
    var recordSource = proxy.__recordSource;
    if (recordSource instanceof require('./RelayRecordSourceProxy')) {
      dumpRelayRecordSourceProxy(recordSource);
    }
  } else if (proxy instanceof require('./RelayRecordSourceProxy')) {
    dumpRelayRecordSourceProxy(proxy);
  } else {
    require('fbjs/lib/warning')(false, 'RelayStoreProxyDebugger: not supported yet.');
  }
}

function dumpRelayRecordSourceProxy(proxy) {
  var mutatorSources = proxy.__mutator.__sources;
  if (mutatorSources.length !== 2) {
    require('fbjs/lib/warning')(false, 'RelayStoreProxyDebugger: expected the mutator sources to have sink and base. ' + 'This is a Relay side bug; please report it to the Relay team.');
    return;
  }
  /* eslint-disable no-console */
  console.groupCollapsed('RelayStoreProxyDebugger', '');
  // Create a 'deep copy' of the records through an extra json encode/decode step.
  console.log('Modified Records: ', JSON.parse(JSON.stringify(mutatorSources[0])));
  console.log('Original Records: ', JSON.parse(JSON.stringify(mutatorSources[1])));
  console.groupEnd();
  /* eslint-enable no-console */
}

module.exports = { dump: dump };