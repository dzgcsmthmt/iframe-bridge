import IFrameBridge from './iframeBridge.js';
import CONSTS from './consts.js';
import { flushQueue }  from './util.js';
import { HandshakeTimeoutError } from './errors.js';

class HostBridge extends IFrameBridge{
    constructor(option){
		super(option);
		delete this.option.targetWindow;
    }

	tryHandshake(resolve,reject){
		super.tryHandshake(resolve,reject);
		
		//开启握手轮询
		this.handshake();
		this.handshakeInterval = setInterval(() => {
			this.handshake();
		}, this.option.handshakeInterval);

		//添加超时监听
		this.handshakeTimeout = setTimeout(() => {
			clearInterval(this.handshakeInterval);
			this.initPromise = null;
			this.handshakeResponseHandler = null;
			reject(new HandshakeTimeoutError(this.option.handshakeTimeout));
			this.destroy();
		}, this.option.handshakeTimeout);
    }
    
    connectDone(resolve,messageEvent){
        super.connectDone(resolve,messageEvent);
        //清理定时器
        clearInterval(this.handshakeInterval);
        clearTimeout(this.handshakeTimeout);
        flushQueue(this.handshakeQueue, this.doPostMessage.bind(this));
    }

    receiveMessage(messageEvent) {
        let payload = super.receiveMessage(messageEvent);
        if(!payload) return;
        this.emit(payload.name, payload);
		this.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
	}

    //所有的协议复用，只是换一个iframe，使用此方法
	setTargetWindow(window){
        this.targetWindow = window;
        //重新创建连接
		this.connected = false;
		this.connectedPromise = new Promise((resolve, reject) => {
           	this.tryHandshake(resolve,reject);
		});
		return this.connectedPromise;
	}

	disconnect(){
		this.targetWindow = null;
		this.connected = false;
	}

}

export default HostBridge;