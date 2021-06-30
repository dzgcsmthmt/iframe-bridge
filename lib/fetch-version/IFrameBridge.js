const EventEmitter = require('eventemitter3');
const inherits = require('inherits');

const BridgePayload = require('./BridgePayload');
const InterceptorManager = require('./InterceptorManager');
const CONSTS = require('./consts');
const {enqueue, flushQueue} = require('./util');
const {HandshakeTimeoutError} = require('./errors');
const CallbackHandler = require('./CallbackHandler');

const DEFAULT_OPTIONS = {
	/**
	 * The window to communicate with (inside an iFrame). If given, the bridge will work in server mode and initiate
	 * the connection. Otherwise, it will listen for incoming handshake and assign source of that message as targetWindow.
	 */
	targetWindow: null,
	
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
	queue_limit: 100,

	/**
	 * callback timeout
	*/
	callback_timeout: 5000
};

/**
 * Very basic wrapper around window.postMessage. Handles handshaking and JSON conversion.
 * Makes sure you don't lose any messages.
 * @param options Overrides for IFrameBridge.DEFAULT_OPTIONS
 * @extends EventEmitter
 */
function IFrameBridge(options = DEFAULT_OPTIONS) {
	options = Object.assign({}, IFrameBridge.DEFAULT_OPTIONS, options);
	
	const _serverMode = !!options.targetWindow;
	let _targetWindow = options.targetWindow;
	const _listenWindow = options.listenWindow || window;
	let _initPromise = null;
	let _handshakeResponseHandler = null;
	let _connected = false;
	const _handshakeQueue = [];
	const _eventEmitter = new EventEmitter();
	let interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager()
	};

	let callbackHandler = new CallbackHandler(interceptors,options.callback_timeout);
	
	_listenWindow.addEventListener('message', receiveMessage, false);
	
	Object.assign(this, /** @lends IFrameBridge.prototype */ {
		init,
		interceptors,
		postMessage,
		fetch,
		on: _eventEmitter.on.bind(_eventEmitter),
		addListener: _eventEmitter.addListener.bind(_eventEmitter),
		once: _eventEmitter.once.bind(_eventEmitter),
		off: _eventEmitter.off.bind(_eventEmitter),
		removeListener: _eventEmitter.removeListener.bind(_eventEmitter),
		removeAllListeners: _eventEmitter.removeAllListeners.bind(_eventEmitter),
	});
	
	function init() {
		if (_connected) {
			return Promise.resolve();
		}
		
		if (_initPromise) {
			return _initPromise;
		}
		
		_initPromise = new Promise((resolve, reject) => {
			let handshakeInterval;
			let handshakeTimeout;
			
			_handshakeResponseHandler = (messageEvent) => {
				_connected = true;
				_initPromise = null;
				_handshakeResponseHandler = null;
				clearInterval(handshakeInterval);
				clearTimeout(handshakeTimeout);
				resolve();
				
				if (!_serverMode) {
					_targetWindow = messageEvent.source;
					doPostMessage(BridgePayload.createHandshake());
				}
				flushQueue(_handshakeQueue, doPostMessage);
			};
			
			if (_serverMode) {
				handshakeInterval = setInterval(sendHandshakeMessage, options.handshake_interval)
				sendHandshakeMessage();
			}
			
			if (options.handshake_timeout) {
				handshakeTimeout = setTimeout(() => {
					clearInterval(handshakeInterval);
					_initPromise = null;
					_handshakeResponseHandler = null;
					reject(new HandshakeTimeoutError(options.handshake_timeout));
				}, options.handshake_timeout);
			}
			
			function sendHandshakeMessage() {
				doPostMessage(BridgePayload.createHandshake());
			}
		});
		return _initPromise;
	}
	
	function postMessage(name, data) {
		const payload = BridgePayload.createAndValidate(name, data);
		
		if (!_connected) {
			enqueue(_handshakeQueue, payload, options.queue_limit);
			return;
		}
		
		return doPostMessage(payload);
	}


	function fetch(name,data){
		return new Promise((resolve,reject) => {
			let payload = BridgePayload.createAndValidate(name, data);
			payload = callbackHandler.request(payload,resolve,reject);
			if (!_connected) {
				enqueue(_handshakeQueue, payload, options.queue_limit);
				return;
			}
			
			doPostMessage(payload);
		})
	}
	
	function doPostMessage(payload) {
		const data = JSON.stringify(payload);
		// console.log(_targetWindow.top == _targetWindow ? 'top send' : 'iframe send',data);
		_targetWindow.postMessage(data, options.origin);
	}
	
	function receiveMessage(messageEvent) {
		/** @type BridgePayload */

		// console.log(this.top == this ? 'top receive' : 'iframe receive',messageEvent.data);
		let payload;
		try {
			// payload = new BridgePayload(JSON.parse(messageEvent.data));
			payload = JSON.parse(messageEvent.data);
		}
		catch (_) {
			return;
		}
		
		if (!payload.__bridge_payload__) {
			return;
		}
		
		if (payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
			if (_handshakeResponseHandler) {
				_handshakeResponseHandler(messageEvent);
			}
			return;
		}
		
		if (payload.name) {
			if(payload.data.callbackId){
				payload = callbackHandler.response(payload.data);
			}else{
				_eventEmitter.emit(payload.name, payload);
			}
		}
		_eventEmitter.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
	}
}

inherits(IFrameBridge, EventEmitter);
IFrameBridge.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

module.exports = IFrameBridge;