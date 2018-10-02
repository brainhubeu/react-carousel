/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayObservable
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Note: This should accept Subscribable<T> instead of RelayObservable<T>,
// however Flow cannot yet distinguish it from T.
var hostReportError = swallowError;

/**
 * Limited implementation of ESObservable, providing the limited set of behavior
 * Relay networking requires.
 *
 * Observables retain the benefit of callbacks which can be called
 * synchronously, avoiding any UI jitter, while providing a compositional API,
 * which simplifies logic and prevents mishandling of errors compared to
 * the direct use of callback functions.
 *
 * ESObservable: https://github.com/tc39/proposal-observable
 */

var RelayObservable = function () {
  function RelayObservable(source) {
    (0, _classCallCheck3['default'])(this, RelayObservable);

    if (process.env.NODE_ENV !== 'production') {
      // Early runtime errors for ill-formed sources.
      if (!source || typeof source !== 'function') {
        throw new Error('Source must be a Function: ' + String(source));
      }
    }
    this._source = source;
  }

  /**
   * When an emitted error event is not handled by an Observer, it is reported
   * to the host environment (what the ESObservable spec refers to as
   * "HostReportErrors()").
   *
   * The default implementation in development rethrows thrown errors, and
   * logs emitted error events to the console, while in production does nothing
   * (swallowing unhandled errors).
   *
   * Called during application initialization, this method allows
   * application-specific handling of unhandled errors. Allowing, for example,
   * integration with error logging or developer tools.
   *
   * A second parameter `isUncaughtThrownError` is true when the unhandled error
   * was thrown within an Observer handler, and false when the unhandled error
   * was an unhandled emitted event.
   *
   *  - Uncaught thrown errors typically represent avoidable errors thrown from
   *    application code, which should be handled with a try/catch block, and
   *    usually have useful stack traces.
   *
   *  - Unhandled emitted event errors typically represent unavoidable events in
   *    application flow such as network failure, and may not have useful
   *    stack traces.
   */


  RelayObservable.onUnhandledError = function onUnhandledError(callback) {
    hostReportError = callback;
  };

  /**
   * Accepts various kinds of data sources, and always returns a RelayObservable
   * useful for accepting the result of a user-provided FetchFunction.
   */


  RelayObservable.from = function from(obj) {
    return isObservable(obj) ? fromObservable(obj) : require('./isPromise')(obj) ? fromPromise(obj) : fromValue(obj);
  };

  /**
   * Creates a RelayObservable, given a function which expects a legacy
   * Relay Observer as the last argument and which returns a Disposable.
   *
   * To support migration to Observable, the function may ignore the
   * legacy Relay observer and directly return an Observable instead.
   */


  RelayObservable.fromLegacy = function fromLegacy(callback) {
    return new RelayObservable(function (sink) {
      var result = callback({
        onNext: sink.next,
        onError: sink.error,
        onCompleted: sink.complete
      });
      return isObservable(result) ? result.subscribe(sink) : function () {
        return result.dispose();
      };
    });
  };

  /**
   * Similar to promise.catch(), observable.catch() handles error events, and
   * provides an alternative observable to use in it's place.
   *
   * If the catch handler throws a new error, it will appear as an error event
   * on the resulting Observable.
   */


  RelayObservable.prototype['catch'] = function _catch(fn) {
    var _this = this;

    return new RelayObservable(function (sink) {
      var subscription = void 0;
      _this.subscribe({
        start: function start(sub) {
          subscription = sub;
        },
        next: sink.next,
        complete: sink.complete,
        error: function (_error2) {
          function error(_x) {
            return _error2.apply(this, arguments);
          }

          error.toString = function () {
            return _error2.toString();
          };

          return error;
        }(function (error) {
          try {
            fn(error).subscribe({
              start: function start(sub) {
                subscription = sub;
              },
              next: sink.next,
              complete: sink.complete,
              error: sink.error
            });
          } catch (error2) {
            sink.error(error2, true /* isUncaughtThrownError */);
          }
        })
      });
      return function () {
        return subscription.unsubscribe();
      };
    });
  };

  /**
   * Returns a new Observable which returns the same values as this one, but
   * modified so that the provided Observer is called to perform a side-effects
   * for all events emitted by the source.
   *
   * Any errors that are thrown in the side-effect Observer are unhandled, and
   * do not affect the source Observable or its Observer.
   *
   * This is useful for when debugging your Observables or performing other
   * side-effects such as logging or performance monitoring.
   */


  RelayObservable.prototype['do'] = function _do(observer) {
    var _this2 = this;

    return new RelayObservable(function (sink) {
      var both = function both(action) {
        return function () {
          try {
            observer[action] && observer[action].apply(observer, arguments);
          } catch (error) {
            hostReportError(error, true /* isUncaughtThrownError */);
          }
          sink[action] && sink[action].apply(sink, arguments);
        };
      };
      return _this2.subscribe({
        start: both('start'),
        next: both('next'),
        error: both('error'),
        complete: both('complete'),
        unsubscribe: both('unsubscribe')
      });
    });
  };

  /**
   * Returns a new Observable which returns the same values as this one, but
   * modified so that the finally callback is performed after completion,
   * whether normal or due to error or unsubscription.
   *
   * This is useful for cleanup such as resource finalization.
   */


  RelayObservable.prototype['finally'] = function _finally(fn) {
    var _this3 = this;

    return new RelayObservable(function (sink) {
      var subscription = _this3.subscribe(sink);
      return function () {
        subscription.unsubscribe();
        fn();
      };
    });
  };

  /**
   * Returns a new Observable which is identical to this one, unless this
   * Observable completes before yielding any values, in which case the new
   * Observable will yield the values from the alternate Observable.
   *
   * If this Observable does yield values, the alternate is never subscribed to.
   *
   * This is useful for scenarios where values may come from multiple sources
   * which should be tried in order, i.e. from a cache before a network.
   */


  RelayObservable.prototype.ifEmpty = function ifEmpty(alternate) {
    var _this4 = this;

    return new RelayObservable(function (sink) {
      var hasValue = false;
      var current = _this4.subscribe({
        next: function next(value) {
          hasValue = true;
          sink.next(value);
        },

        error: sink.error,
        complete: function complete() {
          if (hasValue) {
            sink.complete();
          } else {
            current = alternate.subscribe(sink);
          }
        }
      });
      return function () {
        current.unsubscribe();
      };
    });
  };

  /**
   * Observable's primary API: returns an unsubscribable Subscription to the
   * source of this Observable.
   */


  RelayObservable.prototype.subscribe = function subscribe(observer) {
    if (process.env.NODE_ENV !== 'production') {
      // Early runtime errors for ill-formed observers.
      if (!observer || typeof observer !== 'object') {
        throw new Error('Observer must be an Object with callbacks: ' + String(observer));
      }
    }
    return _subscribe(this._source, observer);
  };

  /**
   * Supports subscription of a legacy Relay Observer, returning a Disposable.
   */


  RelayObservable.prototype.subscribeLegacy = function subscribeLegacy(legacyObserver) {
    var subscription = this.subscribe({
      next: legacyObserver.onNext,
      error: legacyObserver.onError,
      complete: legacyObserver.onCompleted
    });
    return {
      dispose: subscription.unsubscribe
    };
  };

  /**
   * Returns a new Observerable where each value has been transformed by
   * the mapping function.
   */


  RelayObservable.prototype.map = function map(fn) {
    return this.mergeMap(function (value) {
      return fromValue(fn(value));
    });
  };

  /**
   * Returns a new Observable where each value is replaced with a new Observable
   * by the mapping function, the results of which returned as a single
   * merged Observable.
   */


  RelayObservable.prototype.mergeMap = function mergeMap(fn) {
    var _this5 = this;

    return new RelayObservable(function (sink) {
      var subscriptions = [];

      function start(subscription) {
        this._sub = subscription;
        subscriptions.push(subscription);
      }

      function complete() {
        subscriptions.splice(subscriptions.indexOf(this._sub), 1);
        if (subscriptions.length === 0) {
          sink.complete();
        }
      }

      _this5.subscribe({
        start: start,
        next: function next(value) {
          try {
            if (!sink.closed) {
              RelayObservable.from(fn(value)).subscribe({
                start: start,
                next: sink.next,
                error: sink.error,
                complete: complete
              });
            }
          } catch (error) {
            sink.error(error, true /* isUncaughtThrownError */);
          }
        },

        error: sink.error,
        complete: complete
      });

      return function () {
        subscriptions.forEach(function (sub) {
          return sub.unsubscribe();
        });
        subscriptions.length = 0;
      };
    });
  };

  /**
   * Returns a new Observable which first mirrors this Observable, then when it
   * completes, waits for `pollInterval` milliseconds before re-subscribing to
   * this Observable again, looping in this manner until unsubscribed.
   *
   * The returned Observable never completes.
   */


  RelayObservable.prototype.poll = function poll(pollInterval) {
    var _this6 = this;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof pollInterval !== 'number' || pollInterval <= 0) {
        throw new Error('RelayObservable: Expected pollInterval to be positive, got: ' + pollInterval);
      }
    }
    return new RelayObservable(function (sink) {
      var subscription = void 0;
      var timeout = void 0;
      var poll = function poll() {
        subscription = _this6.subscribe({
          next: sink.next,
          error: sink.error,
          complete: function complete() {
            timeout = setTimeout(poll, pollInterval);
          }
        });
      };
      poll();
      return function () {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    });
  };

  /**
   * Returns a Promise which resolves when this Observable yields a first value
   * or when it completes with no value.
   */


  RelayObservable.prototype.toPromise = function toPromise() {
    var _this7 = this;

    return new Promise(function (resolve, reject) {
      var subscription = void 0;
      _this7.subscribe({
        start: function start(sub) {
          subscription = sub;
        },
        next: function next(val) {
          resolve(val);
          subscription.unsubscribe();
        },

        error: reject,
        complete: resolve
      });
    });
  };

  return RelayObservable;
}();

// Use declarations to teach Flow how to check isObservable.


// prettier-ignore
function isObservable(obj) {
  return typeof obj === 'object' && obj !== null && typeof obj.subscribe === 'function';
}

function fromObservable(obj) {
  return obj instanceof RelayObservable ? obj : new RelayObservable(function (sink) {
    return obj.subscribe(sink);
  });
}

function fromPromise(promise) {
  return new RelayObservable(function (sink) {
    // Since sink methods do not throw, the resulting Promise can be ignored.
    promise.then(function (value) {
      sink.next(value);
      sink.complete();
    }, sink.error);
  });
}

function fromValue(value) {
  return new RelayObservable(function (sink) {
    sink.next(value);
    sink.complete();
  });
}

function _subscribe(source, observer) {
  var closed = false;
  var cleanup = void 0;

  // Ideally we would simply describe a `get closed()` method on the Sink and
  // Subscription objects below, however not all flow environments we expect
  // Relay to be used within will support property getters, and many minifier
  // tools still do not support ES5 syntax. Instead, we can use defineProperty.
  var withClosed = function withClosed(obj) {
    return Object.defineProperty(obj, 'closed', { get: function get() {
        return closed;
      } });
  };

  function doCleanup() {
    if (cleanup) {
      if (cleanup.unsubscribe) {
        cleanup.unsubscribe();
      } else {
        try {
          cleanup();
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        }
      }
      cleanup = undefined;
    }
  }

  // Create a Subscription.
  var subscription = withClosed({
    unsubscribe: function unsubscribe() {
      if (!closed) {
        closed = true;

        // Tell Observer that unsubscribe was called.
        try {
          observer.unsubscribe && observer.unsubscribe(subscription);
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }
  });

  // Tell Observer that observation is about to begin.
  try {
    observer.start && observer.start(subscription);
  } catch (error) {
    hostReportError(error, true /* isUncaughtThrownError */);
  }

  // If closed already, don't bother creating a Sink.
  if (closed) {
    return subscription;
  }

  // Create a Sink respecting subscription state and cleanup.
  var sink = withClosed({
    next: function next(value) {
      if (!closed && observer.next) {
        try {
          observer.next(value);
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        }
      }
    },
    error: function (_error3) {
      function error(_x2, _x3) {
        return _error3.apply(this, arguments);
      }

      error.toString = function () {
        return _error3.toString();
      };

      return error;
    }(function (error, isUncaughtThrownError) {
      if (closed || !observer.error) {
        closed = true;
        hostReportError(error, isUncaughtThrownError || false);
        doCleanup();
      } else {
        closed = true;
        try {
          observer.error(error);
        } catch (error2) {
          hostReportError(error2, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }),
    complete: function complete() {
      if (!closed) {
        closed = true;
        try {
          observer.complete && observer.complete();
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }
  });

  // If anything goes wrong during observing the source, handle the error.
  try {
    cleanup = source(sink);
  } catch (error) {
    sink.error(error, true /* isUncaughtThrownError */);
  }

  if (process.env.NODE_ENV !== 'production') {
    // Early runtime errors for ill-formed returned cleanup.
    if (cleanup !== undefined && typeof cleanup !== 'function' && (!cleanup || typeof cleanup.unsubscribe !== 'function')) {
      throw new Error('Returned cleanup function which cannot be called: ' + String(cleanup));
    }
  }

  // If closed before the source function existed, cleanup now.
  if (closed) {
    doCleanup();
  }

  return subscription;
}

function swallowError(_error, _isUncaughtThrownError) {
  // do nothing.
}

if (process.env.NODE_ENV !== 'production') {
  // Default implementation of HostReportErrors() in development builds.
  // Can be replaced by the host application environment.
  RelayObservable.onUnhandledError(function (error, isUncaughtThrownError) {
    if (typeof fail === 'function') {
      // In test environments (Jest), fail() immediately fails the current test.
      fail(String(error));
    } else if (isUncaughtThrownError) {
      // Rethrow uncaught thrown errors on the next frame to avoid breaking
      // current logic.
      setTimeout(function () {
        throw error;
      });
    } else if (typeof console !== 'undefined') {
      // Otherwise, log the unhandled error for visibility.
      // eslint-ignore-next-line no-console
      console.error('RelayObservable: Unhandled Error', error);
    }
  });
}

module.exports = RelayObservable;