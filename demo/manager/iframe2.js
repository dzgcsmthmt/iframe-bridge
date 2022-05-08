import {EmbedBridge} from '../../dist/main.js'
const container = document.getElementById('container');

//使用方法
let bridgeInstance = new EmbedBridge();
//建立连接
bridgeInstance.connect().then(() => {
    console.log('iframe2 connected');
    //发送消息
    bridgeInstance.send('pang','iframe2 pang');
    bridgeInstance.send('haha','iframe2 haha');
});
//绑定事件
bridgeInstance.on('ping',function(payload){
    console.log('iframe2 on ping',payload);
    container.innerHTML += '<p>ping: ' + payload.data + '</p>'
});