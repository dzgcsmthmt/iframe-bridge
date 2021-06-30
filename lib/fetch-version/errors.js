class IFrameBridgeError extends Error {}

class HandshakeTimeoutError extends IFrameBridgeError {
	constructor(timeout) {
		super(`Handshake has timed out after ${timeout}ms. There was no message received from the other side`);
	}
}

class ReservedPayloadNameError extends IFrameBridgeError {
	constructor(name) {
		super(`Message name "${name}" is reserved for internal use`);
	}
}

class CallbackTimeoutError extends IFrameBridgeError {
	constructor(timeout) {
		super(`callback has timed out after ${timeout}ms. There was no callback message received from the other side`);
	}
}



module.exports = {
	IFrameBridgeError,
	HandshakeTimeoutError,
	ReservedPayloadNameError,
	CallbackTimeoutError
};