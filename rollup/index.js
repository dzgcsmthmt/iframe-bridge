// import IFrameBridge from './src/iFrameBridge.js'
// import BridgeManager from './src/bridgeManager.js'
const container = document.getElementById('container');

var iFrame = document.getElementById('iframe');
var iFrame2 = document.getElementById('iframe2');
var messages = document.getElementById('messages');

var manager = new iframeBridge.manager();

manager.create('ZS',iFrame.contentWindow);

manager.create('LS',iFrame2.contentWindow);


manager.on('LS:pang',function(data){
    console.log('top receive msg',data);
});

manager.on('test',function(data){
    console.log('top receive msg',data);
});

manager.send('ping',111)
let count = 1;
setInterval(() => {
    manager.send('LS:ping',count++);
},2000)
	


//1 to 1
/* let bridge = new iframeBridge.bridge({targetWindow: iFrame.contentWindow})
bridge.init().then(() => {
    setTimeout(() => {bridge.send('ping',1);},1000)
});
bridge.on('pang',function(payload){
    console.log(payload);
    container.innerHTML += '<p>pang: ' + payload.data + '</p>';
});
// bridge.postMessage('ping',count++);
for(let i = 1;i <= 5;i++){
    setTimeout(() => {
        bridge.fetch('count',{count: i}).then((data) => {
            console.log('data',data);
        })
    },10000 * Math.random());
} */
