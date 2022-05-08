import EventEmitter from './eventEmitter.js';
import BridgePayload from './bridgePayload.js';
import CONSTS from './consts.js';
import { enqueue }  from './util.js';
import DEFAULT_OPTIONS from './config.js';

class IFrameBridge extends EventEmitter{
    constructor(option){
		super();
		this.option = Object.assign({},DEFAULT_OPTIONS,option);
        this.targetWindow = this.option.targetWindow;
        this.listenWindow = this.option.listenWindow || window;
        this.connected = false;
		this.connectedPromise = null;
		this.handshakeQueue = [];
		this.send = this.postMessage; //add alias

		//for manager mode
		if(!this.option.proxyMode){
			//TODO 没想到好的方式，manager模式所有的事件处理都走顶层的派发，不需要host自己处理接收数据
			this.receiveMessage = this.receiveMessage.bind(this);
			this.listenWindow.addEventListener('message', this.receiveMessage, false);
		}else{
			this.namespace = this.option.namespace;
		}
    }

    connect(){
        if (this.connected) return Promise.resolve();
		if (this.connectedPromise) return this.connectedPromise;
		
		this.connectedPromise = new Promise((resolve, reject) => {
			//尝试握手
           	this.tryHandshake(resolve,reject);
		});
		return this.connectedPromise;
	}
	
	tryHandshake(resolve,reject){
		//绑定握手回执处理函数
		this.handleHandshakeResponse(resolve);
	}

	handleHandshakeResponse(resolve){
		this.handshakeResponseHandler = (messageEvent) => {
			this.connectDone(resolve,messageEvent);
		};
	}

	//建立连接后的处理函数
	connectDone(resolve,messageEvent){
		this.connected = true;
		this.connectedPromise = null;
		this.handshakeResponseHandler = null;
		resolve();
	}

	handshake(){
		this.doPostMessage(BridgePayload.createHandshake());
	}

    postMessage(name, data) {
		//也支持对象写法{name,data}
		const payload = BridgePayload.createAndValidate(name, data);
		//没握手成功前先放入一个队列中
		if (!this.connected) {
			enqueue(this.handshakeQueue, payload, this.option.queueLimit);
			return;
		}
		
		return this.doPostMessage(payload);
	}

	doPostMessage(payload) {
		const data = JSON.stringify(payload);
		this.targetWindow.postMessage(data, this.option.origin);
	}
	
    receiveMessage(messageEvent) {
		//不符合payload协议的信息不处理
		let payload;
		try {
			payload = JSON.parse(messageEvent.data);
		}catch (error) {
			return false;
		}
		if (!payload.__bridge_payload__) return false;

		//处理握手的回执
		if (payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
			if (this.handshakeResponseHandler) {
				this.handshakeResponseHandler(messageEvent);
			}
			return false;
		}
		
		return payload;
	}

	destroy(){
		//解绑事件
		if(!this.option.proxyMode){
			this.listenWindow.removeEventListener('message', this.receiveMessage, false);
		}
	}

}

export default IFrameBridge;