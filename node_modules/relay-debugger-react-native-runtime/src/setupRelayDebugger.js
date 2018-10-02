/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

export function setupRelayDebugger(bridge, debuggerObject) {
  const shouldEnable = Boolean(debuggerObject);

  bridge.onCall('relayDebugger:check', () => shouldEnable);

  if (!shouldEnable) {
    return;
  }

  bridge.onCall('relayDebugger:getEnvironments', () => {
    return debuggerObject.getRegisteredEnvironmentIds();
  });

  bridge.onCall('relayDebugger:getRecord', (env, id) => {
    return debuggerObject.getEnvironmentDebugger(env).getRecord(id);
  });

  bridge.onCall('relayDebugger:getMatchingRecords', (env, search, type) => {
    return debuggerObject
      .getEnvironmentDebugger(env)
      .getMatchingRecords(search, type);
  });

  bridge.onCall('relayDebugger:checkDirty', env => {
    const envDebugger = debuggerObject.getEnvironmentDebugger(env);
    const isDirty = envDebugger.isDirty();
    envDebugger.resetDirty();
    return isDirty;
  });

  bridge.onCall('relayDebugger:startRecording', env => {
    debuggerObject.getEnvironmentDebugger(env).startRecordingMutationEvents();
  });

  bridge.onCall('relayDebugger:stopRecording', env => {
    debuggerObject.getEnvironmentDebugger(env).stopRecordingMutationEvents();
  });

  bridge.onCall('relayDebugger:getRecordedEvents', env => {
    const events = debuggerObject
      .getEnvironmentDebugger(env)
      .getRecordedMutationEvents();

    // serialize errors
    events.forEach(event => {
      if (event.payload instanceof Error) {
        event.payload = { isError: true, message: event.payload.message };
      }
    });

    return events;
  });
}
