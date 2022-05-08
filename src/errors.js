export class IFrameBridgeError extends Error {}

export class HandshakeTimeoutError extends IFrameBridgeError {
	constructor(timeout) {
		super(`Handshake has timed out after ${timeout}ms. There was no message received from the other side`);
	}
}

export class ReservedPayloadNameError extends IFrameBridgeError {
	constructor(name) {
		super(`Message name "${name}" is reserved for internal use`);
	}
}

export class CallbackTimeoutError extends IFrameBridgeError {
	constructor(timeout) {
		super(`callback has timed out after ${timeout}ms. There was no callback message received from the other side`);
	}
}

export class FetchAbortError extends IFrameBridgeError {
	constructor() {
		super(`fetch abort error`);
	}
}

