//TODO 应该直接继承EventEmmiter，从tapable源码里抄过来的
class InterceptorManager {
    constructor(){
        this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     */
    use(handler){
        this.handlers.push(handler);
        return this.handlers.length - 1;
    }

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    };

    
    /**
     * walk over all the registered interceptors
     *
     */

    walk(origin) {
        let res = origin;
        this.handlers.forEach(function(handler) {
            if (handler !== null) {
                res = handler(res);
            }
        });
        return res;
    }

}

export default InterceptorManager;