import EventEmitter from './eventEmitter.js';
import HostBridge from './hostBridge.js';
import CONSTS from './consts.js';
import DEFAULT_OPTIONS from './config.js';

class BridgeManager extends EventEmitter{
    constructor(option){
        super(option);
        this.option = Object.assign({},DEFAULT_OPTIONS,option);
        //这个map维护了name和window的关系
        this.nsMap = {};
        //这个map维护了window和bridge的关系
        this.bridgeMap = new WeakMap(); //为了防止内存泄漏
        //记录命名空间绑定的事件，销毁时解绑
        this.listenerSet = new Set();
        //维护没有命名空间的事件绑定，为create的新的bridge添加绑定
        this.eventNameSet = new Set();
        this.send = this.postMessage;
        this.receiveMessage = this.receiveMessage.bind(this)
        window.addEventListener('message', this.receiveMessage, false);
    }

    create(name,targetWindow){
        //如果有重名的先销毁上一个
        if(this.nsMap[name]){
            this.destroy(name);
        }

        this.nsMap[name] = targetWindow;
        let bridge = new HostBridge({
            namespace: name,
            targetWindow: targetWindow,
            proxyMode: true
        });
        this.bridgeMap.set(targetWindow, bridge);
        //为新创建的bridge添加事件绑定
        for(let eventName of this.eventNameSet){
            let listeners = this.getListeners(eventName);
            listeners && listeners.forEach(listener => {
                this.on(name + ':' + eventName,listener);
            })
        }
        return bridge.connect();
    }
    
    /**
     * 
     * @param {String} name 
     * 事件和命名空间基于:分隔
     * 有命名空间，只处理此命名空间的iframe的事件，没有命名空间接收所有iframe的事件
     * @param {Function} cb 回调函数
     */
    on(name,cb) {
        if(!name) return;
        let arr = name.split(':');
        if(arr[1]){
            this.listenerSet.add(name);
        }else{
            this.eventNameSet.add(name);
            Object.keys(this.nsMap).forEach(ns => {
                let nsName = ns + ':' + name;
                super.on(nsName,cb);
                this.listenerSet.add(nsName);
            })
        }
        super.on(name,cb);
    }

    /**
     * 
     * @param {String} name 
     * 事件和命名空间基于:分隔
     * 有命名空间，只给指定的iframe发送消息，没有命名空间给所有iframe的发送消息
     * @param {...*} data 
     */
    postMessage(name, data) {
        if(!name) return;
        let arr = name.split(':');
        if(arr[1]){
            let bridge,win = this.nsMap[arr[0]];
            if(bridge = this.bridgeMap.get(win)){
                bridge.send(arr[1],data);
            }
        }else{
            Object.keys(this.nsMap).forEach(key => {
                let bridge = this.bridgeMap.get(this.nsMap[key]);
                bridge.send(name,data);
            })
        }
	}
	
    receiveMessage(messageEvent) {
        let targetWindow = messageEvent.source;
        if(!this.bridgeMap.has(targetWindow)) return;
		let payload;
		try {
			payload = JSON.parse(messageEvent.data);
		}catch (error) {
			return;
		}
        
        if (!payload.__bridge_payload__) return;
        
        let bridge = this.bridgeMap.get(targetWindow);
		
		if (payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
			if (bridge.handshakeResponseHandler) {
				bridge.handshakeResponseHandler(messageEvent);
			}
			return;
		}
		
		if (payload.name) {
            this.emit(bridge.namespace + ":" + payload.name, Object.assign(payload,{ns: bridge.namespace}));
		}
		this.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
    }
    
    destroy(){
        window.removeEventListener('message', this.receiveMessage, false);
    }

    disconnect(name){
        //传入个数组，批量删除
        if(Array.isArray(name)){
            name.forEach((n) => {
                this.disconnect(n)
            });
            return;
        }

        //传入name，删除所有的引用
        if(!this.nsMap[name]) return;

        let targetWindow = this.nsMap[name];
        delete this.nsMap[name];
        if(targetWindow){
            this.bridgeMap.delete(targetWindow);
        }
        for(let listenerName of this.listenerSet){
            let ns = listenerName.split(':')[0];
            if(ns === name){
                this.listenerSet.delete(listenerName);
                this.off(listenerName);
            }
        }
    }

}
export default BridgeManager;