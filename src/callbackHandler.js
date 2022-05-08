import { CallbackTimeoutError } from './errors.js';
let callbackId = 1;
class CallbackHandler {
    constructor(interceptors,callback_timeout){
        // this.callbackId = callbackId++;
        this.callbackMap = {};
        this.interceptors = interceptors;
        this.callback_timeout = callback_timeout;
        this.key = (Math.random() + '').substr(2,8);
    }

    request(payload,resolve,reject){
        let cbId = callbackId++;
        payload = this.interceptors.request.walk(Object.assign({__callbackId__: cbId},payload));
        this.callbackMap[cbId] = {resolve,reject};
        setTimeout(() => {
            if(this.callbackMap[cbId]){
                reject(new CallbackTimeoutError(this.callback_timeout));
                delete this.callbackMap[cbId];
            }
        },this.callback_timeout);
        // console.log('request',this.key,payload,this.callbackMap);
        return payload;
    }

    response(payload){
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
}

export default CallbackHandler;