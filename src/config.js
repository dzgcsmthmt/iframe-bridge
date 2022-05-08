export default {
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
	handshakeInterval: 200,
	
	/**
	 * How long do we attempt to reach the other iFrame before we error out
	 */
	handshakeTimeout: 5000,
	
	/**
	 * Max number of messages to queue
	 */
	queueLimit: 100,

	/**
	 * callback timeout
	*/
	callbackTimeout: 5000
};