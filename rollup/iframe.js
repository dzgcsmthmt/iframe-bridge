// import IFrameBridge from './src/iFrameBridge.js'
const container = document.getElementById('container');


var bridge = new iframeBridge.bridge();
var count = 1;
bridge.init();
bridge.on('ping',function(payload){
    console.log('iframe',payload);
    container.innerHTML += '<p>ping: ' + payload.data + '</p>'
    setTimeout(() => {bridge.postMessage('test',11111);},1000);
    bridge.send('pang','pangdgsfs');
});

bridge.on('count',function(payload){
    console.log('fetch',payload);
    bridge.postMessage('cb',{callbackId: payload.__callbackId__,data: {code:0,msg:'',data:Math.random()}});
});