import IFrameBridge from './iframeBridge.js';
import BridgePayload from './bridgePayload.js';
import InterceptorManager from './interceptorManager.js';
import CONSTS from './consts.js';
import { enqueue, flushQueue, isFunction }  from './util.js';
import { FetchAbortError } from './errors.js';
import CallbackHandler from './callbackHandler.js';

class EmbedBridge extends IFrameBridge{
    constructor(option){
		super(option);
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
		};
        this.callbackHandler = new CallbackHandler(this.interceptors,this.option.callbackTimeout);
    }

    connectDone(resolve,messageEvent){
        super.connectDone(resolve,messageEvent);
        //设置targetWindow，握手回执
        this.targetWindow = messageEvent.source;
        this.handshake();
        flushQueue(this.handshakeQueue, this.doPostMessage.bind(this));
    }

    //配对模式，发送同一个类型的请求，基于callbackId
    //cancelHandler 也可以取消请求，axios cancelToken简易实现
	fetch(name,data,cancelHandler){
		return new Promise((resolve,reject) => {
			if(isFunction(cancelHandler)){
				cancelHandler(() => reject(new FetchAbortError()));
			}
			let payload = BridgePayload.createAndValidate(name, data);
			payload = this.callbackHandler.request(payload,resolve,reject);
			if (!this.connected) {
				enqueue(this.handshakeQueue, payload, this.option.queueLimit);
				return;
			}
			this.doPostMessage(payload);
		})
	}

    receiveMessage(messageEvent) {
        let payload = super.receiveMessage(messageEvent);
        if(!payload) return;
        
		if (payload.name) {
            //基于fetch的处理
			if(payload.data.callbackId){
				payload = this.callbackHandler.response(payload.data);
			}else{
				this.emit(payload.name, payload);
			}
		}
		
		this.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
	}

}

export default EmbedBridge;