/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* eslint-disable no-console */
import { Bridge } from './bridge';
import { setupRelayDebugger } from './setupRelayDebugger';

export function connectToDevTools(options) {
  const { host = 'localhost', port = 8098, isAppActive = () => true } =
    options || {};

  function scheduleRetry() {
    setTimeout(() => connectToDevTools(options), 2000);
  }

  if (!isAppActive()) {
    // If the app is in background, maybe retry later.
    // Don't actually attempt to connect until we're in foreground.
    scheduleRetry();
    return;
  }

  const messageListeners = [];
  const closeListeners = [];
  const uri = 'ws://' + host + ':' + port;
  const ws = new window.WebSocket(uri);
  ws.onclose = handleClose;
  ws.onerror = handleClose;
  ws.onmessage = handleMessage;
  ws.onopen = function() {
    const wall = {
      listen(fn) {
        messageListeners.push(fn);
      },
      onClose(fn) {
        closeListeners.push(fn);
      },
      send(data) {
        ws.send(JSON.stringify(data));
      },
    };
    setupBackend(wall);
  };

  let hasClosed = false;
  function handleClose() {
    if (!hasClosed) {
      hasClosed = true;
      scheduleRetry();
      closeListeners.forEach(fn => fn());
    }
  }

  function handleMessage(evt) {
    let data;
    try {
      data = JSON.parse(evt.data);
    } catch (e) {
      console.error('failed to parse json: ' + evt.data);
      return;
    }
    messageListeners.forEach(fn => {
      try {
        fn(data);
      } catch (e) {
        // jsc doesn't play so well with tracebacks that go into eval'd code,
        // so the stack trace here will stop at the `eval()` call. Getting the
        // message that caused the error is the best we can do for now.
        console.log(data);
        throw e;
      }
    });
  }
}

function setupBackend(wall) {
  const bridge = new Bridge(wall);
  setupRelayDebugger(bridge, window.__RELAY_DEBUGGER__);
}
