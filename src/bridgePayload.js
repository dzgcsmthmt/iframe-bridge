import { ReservedPayloadNameError } from './errors.js';
import CONSTS from './consts.js';
import { isObject } from './util.js'

class BridgePayload {
	constructor(name,data){
		let source = isObject( name ) ? name : {name,data};
		this.__bridge_payload__ = true;
		this.timestamp = Date.now();
		this.name = source.name;
		this.data = source.data;
	}

	static createAndValidate(name,data){
		let payload = new BridgePayload(name,data);
		if (payload.name === CONSTS.MESSAGE_EVENT_NAME || payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
			throw new ReservedPayloadNameError(payload.name);
		}
		
		return payload;
	}

	static createHandshake(){
		return new BridgePayload(CONSTS.HANDSHAKE_MESSAGE_NAME)
	}

}

export default BridgePayload;