let IFrameBridge = require('./IFrameBridge');

function BridgeManager() {
    this.bridgeMap = {};
}

BridgeManager.prototype.create = function use(name,targetWindow) {
    var bridge = new IFrameBridge({
		targetWindow: targetWindow
    });
    this.bridgeMap[name] = bridge;
    setTimeout(() => {
        bridge.init();
    })
    
};

/**
 * 
 */
BridgeManager.prototype.destroy = function eject(name) {
    if (this.bridgeMap[name]) {
        //取消所有的事件，删除map的可以，
        this.bridgeMap.off();
        delete this.bridgeMap[name];
    }
};

/**
 * 
 *
 */
BridgeManager.prototype.on = function(name,cb) {
    if(!name) return;
    let arr = name.split(':');
    if(arr[1]){
        this.bridgeMap[arr[0]] && this.bridgeMap[arr[0]].on(arr[1],cb);
    }else{
        Object.keys(this.bridgeMap).forEach(key => {
            this.bridgeMap[key].on(name,cb)
        })
    }
};

BridgeManager.prototype.postMessage = function (name,data) {
    if(!name) return;
    let arr = name.split(':');
    if(arr[1]){
        this.bridgeMap[arr[0]] && this.bridgeMap[arr[0]].postMessage(arr[1],data);
    }else{
        Object.keys(this.bridgeMap).forEach(key => {
            this.bridgeMap[key].postMessage(name,data);
        })
    }
};

module.exports = BridgeManager;