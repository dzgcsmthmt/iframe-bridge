const BridgePayload = require('./BridgePayload');
const {enqueue, flushQueue} = require('./util');
const {HandshakeTimeoutError} = require('./errors');


function Connector(name,targetWindow,options){
    this.name = name;
    this.targetWindow = targetWindow;
    this.options = options;
	// this.handshakeResponseHandler = null;
	this.connected = false;
    this.handshakeQueue = [];
    this.shankHand();
}

Connector.prototype.shankHand = function(){
    this.handshakeInterval = setInterval(() => {
        this.sendHandshakeMessage();
    }, this.options.handshake_interval)
    
    this.handshakeTimeout = setTimeout(() => {
        clearInterval(this.handshakeInterval);
        throw new HandshakeTimeoutError(this.options.handshake_timeout);
    }, this.options.handshake_timeout);

    this.sendHandshakeMessage();

}

Connector.prototype.sendHandshakeMessage = function(){
    this.doPostMessage(BridgePayload.createHandshake()); 
}

Connector.prototype.handleHandshakeResponse = function(){
    this.connected = true;
    clearInterval(this.handshakeInterval);
    clearTimeout(this.handshakeTimeout);
    flushQueue(this.handshakeQueue, this.doPostMessage.bind(this));
}

Connector.prototype.postMessage = function(name,data){
    const payload = BridgePayload.createAndValidate(name, data);
    if (!this.connected) {
        enqueue(this.handshakeQueue, payload, this.options.queue_limit);
        return;
    }
    return this.doPostMessage(payload);
}

Connector.prototype.doPostMessage = function(payload){
    const data = JSON.stringify(payload);
    this.targetWindow.postMessage(data, this.options.origin);
}

module.exports = Connector;