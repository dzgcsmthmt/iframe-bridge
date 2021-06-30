(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IFrameBridge"] = factory();
	else
		root["IFrameBridge"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IFrameBridgeError = function (_Error) {
	_inherits(IFrameBridgeError, _Error);

	function IFrameBridgeError() {
		_classCallCheck(this, IFrameBridgeError);

		return _possibleConstructorReturn(this, (IFrameBridgeError.__proto__ || Object.getPrototypeOf(IFrameBridgeError)).apply(this, arguments));
	}

	return IFrameBridgeError;
}(Error);

var HandshakeTimeoutError = function (_IFrameBridgeError) {
	_inherits(HandshakeTimeoutError, _IFrameBridgeError);

	function HandshakeTimeoutError(timeout) {
		_classCallCheck(this, HandshakeTimeoutError);

		return _possibleConstructorReturn(this, (HandshakeTimeoutError.__proto__ || Object.getPrototypeOf(HandshakeTimeoutError)).call(this, "Handshake has timed out after " + timeout + "ms. There was no message received from the other side"));
	}

	return HandshakeTimeoutError;
}(IFrameBridgeError);

var ReservedPayloadNameError = function (_IFrameBridgeError2) {
	_inherits(ReservedPayloadNameError, _IFrameBridgeError2);

	function ReservedPayloadNameError(name) {
		_classCallCheck(this, ReservedPayloadNameError);

		return _possibleConstructorReturn(this, (ReservedPayloadNameError.__proto__ || Object.getPrototypeOf(ReservedPayloadNameError)).call(this, "Message name \"" + name + "\" is reserved for internal use"));
	}

	return ReservedPayloadNameError;
}(IFrameBridgeError);

module.exports = {
	IFrameBridgeError: IFrameBridgeError,
	HandshakeTimeoutError: HandshakeTimeoutError,
	ReservedPayloadNameError: ReservedPayloadNameError
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	HANDSHAKE_MESSAGE_NAME: '___handshake___',
	MESSAGE_EVENT_NAME: 'message'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(0),
    ReservedPayloadNameError = _require.ReservedPayloadNameError;

var CONSTS = __webpack_require__(1);

function BridgePayload(source) {
	this.__bridge_payload__ = true;
	this.timestamp = new Date();

	if (!source) {
		return;
	}

	this.name = source.name;
	this.data = source.data;
}

BridgePayload.createAndValidate = function (name, data) {
	var payload = void 0;
	if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
		payload = new BridgePayload(name);
	} else {
		payload = new BridgePayload();
		payload.name = name;
		payload.data = data;
	}

	if (payload.name === CONSTS.MESSAGE_EVENT_NAME || payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
		throw new ReservedPayloadNameError(payload.name);
	}

	return payload;
};

BridgePayload.createHandshake = function () {
	var payload = new BridgePayload();
	payload.name = CONSTS.HANDSHAKE_MESSAGE_NAME;
	return payload;
};

module.exports = BridgePayload;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Enqueue item into the queue, observing limit (if provided)
 * @param {Array} queue
 * @param el
 * @param limit
 */
function enqueue(queue, el) {
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	queue.push(el);
	if (limit && queue.length > limit) {
		queue.splice(0, 1);
	}
}

/**
 * Empty queue using consumer fn, one by one. If consumer returns false, item is re-enqueued.
 * @param {Array} queue
 * @param {Function} consumer
 */
function flushQueue(queue, consumer) {
	var queueLimit = 0;
	while (queue.length > queueLimit) {
		var msg = queue.splice(0, 1)[0];
		if (msg) {
			if (consumer(msg) === false) {
				queue.push(msg);
				queueLimit++;
			}
		}
	}

	return queueLimit;
}

module.exports = {
	enqueue: enqueue,
	flushQueue: flushQueue
};

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HostBridge = __webpack_require__(9);

module.exports = HostBridge;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Connector = __webpack_require__(10);
var CONSTS = __webpack_require__(1);
var EventEmitter = __webpack_require__(3);

var DEFAULT_OPTIONS = {
    /**
     * Origin to use when connecting to other window (only in server mode)
     */
    origin: '*',

    /**
     * How often do we attempt to reach the iFrame (only in server mode)
     */
    handshake_interval: 200,

    /**
     * How long do we attempt to reach the other iFrame before we error out
     */
    handshake_timeout: 5000,

    /**
     * Max number of messages to queue
     */
    queue_limit: 100
};

function HostBridge(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.connectors = {};
    //本来想给window指定name，但是怕污染原始数据，自己维护，key是window，value是命名
    this.mapWindow = new Map();
    this.eventListenerMap = new Map();
    this.eventEmitter = new EventEmitter();
    window.addEventListener('message', this.receiveMessage.bind(this), false);
}

HostBridge.prototype.on = function (namespace, name, cb) {
    if (Array.isArray(namespace)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = namespace[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var ns = _step.value;

                this.eventEmitter.on(ns + ':' + name, cb);
                if (this.connectors[ns]) {
                    var listener = void 0;
                    if (listener = this.eventListenerMap.get(this.connectors[ns].targetWindow)) {
                        listener[name] = 1;
                    } else {
                        var obj = {};
                        obj[name] = 1;
                        this.eventListenerMap.set(this.connectors[ns].targetWindow, obj);
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return;
    }

    cb = name;
    name = namespace;

    var arr = name.split(':');
    if (arr[1]) {
        this.eventEmitter.on(name, cb);
        if (this.connectors[arr[0]]) {
            var _listener = void 0;
            if (_listener = this.eventListenerMap.get(this.connectors[arr[0]].targetWindow)) {
                _listener[name] = 1;
            } else {
                var _obj = {};
                _obj[arr[1]] = 1;
                this.eventListenerMap.set(this.connectors[arr[0]].targetWindow, _obj);
            }
        }
    } else {
        this.eventEmitter.on(arr[0], cb);
    }
};

HostBridge.prototype.connect = function (name, targetWindow) {
    var _this = this;

    if (Array.isArray(name)) {
        name.forEach(function (obj) {
            _this.connect(obj.name, obj.targetWindow);
        });
        return;
    }
    this.connectors[name] = new Connector(name, targetWindow, this.options);
    this.mapWindow.set(targetWindow, name);
};

HostBridge.prototype.postMessage = function (namespace, name, data) {
    var _this2 = this;

    if (Array.isArray(namespace)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = namespace[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var ns = _step2.value;

                this.connectors[ns].postMessage(name, data);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return;
    }

    data = name;
    name = namespace;
    var arr = name.split(':');
    if (arr[1]) {
        this.connectors[arr[0]].postMessage(arr[1], data);
    } else {
        Object.keys(this.connectors).forEach(function (ns) {
            _this2.connectors[ns].postMessage(name, data);
        });
    }
};

HostBridge.prototype.receiveMessage = function (messageEvent) {
    var payload = void 0;
    var sourceWindow = messageEvent.source;
    try {
        payload = JSON.parse(messageEvent.data);
    } catch (err) {
        return;
    }

    if (!payload.__bridge_payload__) {
        return;
    }

    if (payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
        var connector = this.connectors[this.mapWindow.get(sourceWindow)] || {};
        if (connector.handleHandshakeResponse) {
            connector.handleHandshakeResponse(messageEvent);
        }
        return;
    }

    if (payload.name) {
        if (this.eventListenerMap.get(sourceWindow) && this.eventListenerMap.get(sourceWindow)[payload.name]) {
            this.eventEmitter.emit(this.mapWindow.get(sourceWindow) + ':' + payload.name, payload.data);
        } else {
            this.eventEmitter.emit(payload.name, payload.data);
        }
    }
    this.eventEmitter.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
};

module.exports = HostBridge;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BridgePayload = __webpack_require__(2);

var _require = __webpack_require__(4),
    enqueue = _require.enqueue,
    flushQueue = _require.flushQueue;

var _require2 = __webpack_require__(0),
    HandshakeTimeoutError = _require2.HandshakeTimeoutError;

function Connector(name, targetWindow, options) {
    this.name = name;
    this.targetWindow = targetWindow;
    this.options = options;
    // this.handshakeResponseHandler = null;
    this.connected = false;
    this.handshakeQueue = [];
    this.shankHand();
}

Connector.prototype.shankHand = function () {
    var _this = this;

    this.handshakeInterval = setInterval(function () {
        _this.sendHandshakeMessage();
    }, this.options.handshake_interval);

    this.handshakeTimeout = setTimeout(function () {
        clearInterval(_this.handshakeInterval);
        throw new HandshakeTimeoutError(_this.options.handshake_timeout);
    }, this.options.handshake_timeout);

    this.sendHandshakeMessage();
};

Connector.prototype.sendHandshakeMessage = function () {
    this.doPostMessage(BridgePayload.createHandshake());
};

Connector.prototype.handleHandshakeResponse = function () {
    this.connected = true;
    clearInterval(this.handshakeInterval);
    clearTimeout(this.handshakeTimeout);
    flushQueue(this.handshakeQueue, this.doPostMessage.bind(this));
};

Connector.prototype.postMessage = function (name, data) {
    var payload = BridgePayload.createAndValidate(name, data);
    if (!this.connected) {
        enqueue(this.handshakeQueue, payload, this.options.queue_limit);
        return;
    }
    return this.doPostMessage(payload);
};

Connector.prototype.doPostMessage = function (payload) {
    var data = JSON.stringify(payload);
    this.targetWindow.postMessage(data, this.options.origin);
};

module.exports = Connector;

/***/ })
/******/ ]);
});
//# sourceMappingURL=host_bridge.js.map