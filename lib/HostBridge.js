const Connector = require('./Connector');
const CONSTS = require('./consts');
const EventEmitter = require('eventemitter3');

const DEFAULT_OPTIONS = {
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
};

function HostBridge(options) {
    this.options = Object.assign({},DEFAULT_OPTIONS,options);
    this.connectors = {};
    //本来想给window指定name，但是怕污染原始数据，自己维护，key是window，value是命名
    this.mapWindow = new Map();
    this.eventListenerMap = new Map();
    this.eventEmitter = new EventEmitter();
	window.addEventListener('message', this.receiveMessage.bind(this), false);
}

HostBridge.prototype.on = function(namespace,name,cb){
    if(Array.isArray(namespace)){
        for(let ns of namespace){
            this.eventEmitter.on(ns + ':' + name,cb);
            if(this.connectors[ns]){
                let listener;
                if(listener = this.eventListenerMap.get(this.connectors[ns].targetWindow)){
                    listener[name] = 1;
                }else{
                    let obj = {};
                    obj[name] = 1;
                    this.eventListenerMap.set(this.connectors[ns].targetWindow,obj);
                }
            }
        }
        return;
    }

    cb = name;
    name = namespace;

    let arr = name.split(':');
    if(arr[1]){
        this.eventEmitter.on(name,cb);
        if(this.connectors[arr[0]]){
            let listener;
            if(listener = this.eventListenerMap.get(this.connectors[arr[0]].targetWindow)){
                listener[name] = 1;
            }else{
                let obj = {};
                obj[arr[1]] = 1;
                this.eventListenerMap.set(this.connectors[arr[0]].targetWindow,obj);
            }
        }
    }else{
        this.eventEmitter.on(arr[0],cb);
    }
}

HostBridge.prototype.connect = function(name,targetWindow){
    if(Array.isArray(name)){
        name.forEach((obj) => {
            this.connect(obj.name,obj.targetWindow);
        });
        return;
    }
    this.connectors[name] = new Connector(name,targetWindow,this.options);
    this.mapWindow.set(targetWindow,name);
}

HostBridge.prototype.postMessage = function(namespace,name,data){
    if(Array.isArray(namespace)){
        for(let ns of namespace){
            this.connectors[ns].postMessage(name,data);
        }
        return;
    }
        
    data = name;
    name = namespace;
    let arr = name.split(':');
    if(arr[1]){
        this.connectors[arr[0]].postMessage(arr[1],data);
    }else{
        Object.keys(this.connectors).forEach((ns) => {
            this.connectors[ns].postMessage(name,data);
        })
    }
}

HostBridge.prototype.receiveMessage = function(messageEvent){
    let payload;
    let sourceWindow = messageEvent.source;
    try {
        payload = JSON.parse(messageEvent.data);
    }catch (err) {
        return;
    }
    
    if (!payload.__bridge_payload__) {
        return;
    }
    
    if (payload.name === CONSTS.HANDSHAKE_MESSAGE_NAME) {
        let connector = this.connectors[this.mapWindow.get(sourceWindow)] || {};
        if (connector.handleHandshakeResponse) {
            connector.handleHandshakeResponse(messageEvent);
        }
        return;
    }
    
    if (payload.name) {
        if(this.eventListenerMap.get(sourceWindow) && this.eventListenerMap.get(sourceWindow)[payload.name]){
            this.eventEmitter.emit(this.mapWindow.get(sourceWindow) + ':' + payload.name, payload.data);
        }else{
            this.eventEmitter.emit(payload.name, payload.data);
        }
    }
    this.eventEmitter.emit(CONSTS.MESSAGE_EVENT_NAME, payload);
}

module.exports = HostBridge;