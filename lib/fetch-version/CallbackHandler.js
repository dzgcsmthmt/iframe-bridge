
const {CallbackTimeoutError} = require('./errors');

function CallbackHandler(interceptors,callback_timeout) {
    this.callbackId = 1;
    this.callbackMap = {};
    this.interceptors = interceptors;
    this.callback_timeout = callback_timeout;
    this.key = (Math.random() + '').substr(2,8);
    // console.log(this.key,'key');
}

CallbackHandler.prototype.request = function(payload,resolve,reject){
    let cbId = this.callbackId;
    payload = this.interceptors.request.walk(Object.assign({__callbackId__: cbId},payload));
    this.callbackMap[cbId] = {resolve,reject};
    setTimeout(() => {
        if(this.callbackMap[cbId]){
            reject(new CallbackTimeoutError(this.callback_timeout));
            delete this.callbackMap[cbId];
        }
    },this.callback_timeout);
    this.callbackId++;
    // console.log('request',this.key,payload,this.callbackMap);
    return payload;
},

CallbackHandler.prototype.response = function(payload){
    // console.log('response',payload,this.key);
    payload = this.interceptors.response.walk(payload);
    if(!this.callbackMap[payload.callbackId])return payload;
    if(payload.data.code === 0){
        this.callbackMap[payload.callbackId].resolve(payload.data.data);
    }else{
        this.callbackMap[payload.callbackId].reject(payload.data.msg);
    }
    delete this.callbackMap[payload.callbackId];
    return payload;
}

module.exports = CallbackHandler;