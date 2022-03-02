// import IFrameBridge from './src/iFrameBridge.js'
const container = document.getElementById('container');

var bridge = new iframeBridge.bridge();
var count = 1;
bridge.init();
bridge.on('ping',function(payload){
    console.log('iframe2',payload);
    container.innerHTML += '<p>ping: ' + payload.data + '</p>'
    bridge.send('test',2222);
    bridge.send('pang',1234);
});