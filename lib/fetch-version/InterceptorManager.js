function InterceptorManager() {
    this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 */
InterceptorManager.prototype.use = function use(handler) {
    if(Array.isArray(handler)){
        Array.prototype.push.call(this.handlers,chain);
    }else{
        this.handlers.push(handler);
    }
    
    return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
        this.handlers[id] = null;
    }
};

/**
 * walk over all the registered interceptors
 *
 */
InterceptorManager.prototype.walk = function forEach(origin) {
    let res = origin;
    this.handlers.forEach(function(handler) {
        if (handler !== null) {
            res = handler(res);
        }
    });
    return res;
};

module.exports = InterceptorManager;