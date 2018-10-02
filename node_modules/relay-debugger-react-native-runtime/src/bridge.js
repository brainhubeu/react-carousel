/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// A simplified version of Bridge copied from react-devtools

// Use the polyfill if the function is not native implementation
function getWindowFunction(name, polyfill) {
  if (String(window[name]).indexOf('[native code]') === -1) {
    return polyfill;
  }
  return window[name];
}

// Custom polyfill that runs the queue with a backoff.
// If you change it, make sure it behaves reasonably well in Firefox.
const cancelIdleCallback = getWindowFunction(
  'cancelIdleCallback',
  clearTimeout,
);

const requestIdleCallback = getWindowFunction('requestIdleCallback', function(
  cb,
) {
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Infinity;
      },
    });
  }, 500);
});

export class Bridge {
  constructor(wall) {
    this._cbs = new Map();
    this._inspectables = new Map();
    this._cid = 0;
    this._listeners = {};
    this._buffer = [];
    this._flushHandle = null;
    this._callers = {};
    this._paused = false;
    this._wall = wall;

    wall.listen(this._handleMessage.bind(this));
  }

  call(name, args, cb) {
    const _cid = this._cid++;
    this._cbs.set(_cid, cb);

    this._wall.send({
      type: 'call',
      callback: _cid,
      args,
      name,
    });
  }

  onCall(name, handler) {
    if (this._callers[name]) {
      throw new Error('only one call handler per call name allowed');
    }
    this._callers[name] = handler;
  }

  pause() {
    this._wall.send({
      type: 'pause',
    });
  }

  resume() {
    this._wall.send({
      type: 'resume',
    });
  }

  send(evt, data) {
    this._buffer.push({ evt, data });
    this.scheduleFlush();
  }

  scheduleFlush() {
    if (!this._flushHandle && this._buffer.length) {
      const timeout = this._paused ? 5000 : 500;
      this._flushHandle = requestIdleCallback(
        this.flushBufferWhileIdle.bind(this),
        { timeout },
      );
    }
  }

  cancelFlush() {
    if (this._flushHandle) {
      cancelIdleCallback(this._flushHandle);
      this._flushHandle = null;
    }
  }

  flushBufferWhileIdle(deadline) {
    this._flushHandle = null;

    // Magic numbers were determined by tweaking in a heavy UI and seeing
    // what performs reasonably well both when DevTools are hidden and visible.
    // The goal is that we try to catch up but avoid blocking the UI.
    // When paused, it's okay to lag more, but not forever because otherwise
    // when user activates React tab, it will freeze syncing.
    const chunkCount = this._paused ? 20 : 10;
    const chunkSize = Math.round(this._buffer.length / chunkCount);
    const minChunkSize = this._paused ? 50 : 100;

    while (
      this._buffer.length &&
      (deadline.timeRemaining() > 0 || deadline.didTimeout)
    ) {
      const take = Math.min(
        this._buffer.length,
        Math.max(minChunkSize, chunkSize),
      );
      const currentBuffer = this._buffer.splice(0, take);
      this.flushBufferSlice(currentBuffer);
    }

    if (this._buffer.length) {
      this.scheduleFlush();
    }
  }

  flushBufferSlice(bufferSlice) {
    const events = bufferSlice.map(({ evt, data }) => {
      return { type: 'event', evt, data };
    });
    this._wall.send({ type: 'many-events', events });
  }

  on(evt, fn) {
    if (!this._listeners[evt]) {
      this._listeners[evt] = [fn];
    } else {
      this._listeners[evt].push(fn);
    }
  }

  off(evt, fn) {
    if (!this._listeners[evt]) {
      return;
    }
    const ix = this._listeners[evt].indexOf(fn);
    if (ix !== -1) {
      this._listeners[evt].splice(ix, 1);
    }
  }

  once(evt, fn) {
    const self = this;
    const listener = function() {
      fn.apply(this, arguments);
      self.off(evt, listener);
    };
    this.on(evt, listener);
  }

  _handleMessage(payload) {
    if (payload.type === 'resume') {
      this._paused = false;
      this.scheduleFlush();
      return;
    }

    if (payload.type === 'pause') {
      this._paused = true;
      this.cancelFlush();
      return;
    }

    if (payload.type === 'callback') {
      const callback = this._cbs.get(payload.id);
      if (callback) {
        callback(...payload.args);
        this._cbs.delete(payload.id);
      }
      return;
    }

    if (payload.type === 'call') {
      this._handleCall(payload.name, payload.args, payload.callback);
      return;
    }

    if (payload.type === 'event') {
      const fns = this._listeners[payload.evt];
      const data = payload.data;
      if (fns) {
        fns.forEach(fn => fn(data));
      }
    }

    if (payload.type === 'many-events') {
      payload.events.forEach(event => {
        const handlers = this._listeners[event.evt];
        if (handlers) {
          handlers.forEach(fn => fn(event.data));
        }
      });
    }
  }

  _handleCall(name, args, callback) {
    if (!this._callers[name]) {
      // eslint-disable-next-line no-console
      console.warn('unknown call: "' + name + '"');
      return;
    }
    const argsList = !Array.isArray(args) ? [args] : args;
    let result;
    try {
      result = this._callers[name].apply(null, argsList);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to call', e);
      return;
    }
    this._wall.send({
      type: 'callback',
      id: callback,
      args: [result],
    });
  }
}
