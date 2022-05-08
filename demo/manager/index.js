import {BridgeManager} from '../../dist/main.js'
const container = document.getElementById('container');
const iFrame = document.getElementById('iframe'); 
const iFrame2 = document.getElementById('iframe2'); 

//使用方法
let manager = new BridgeManager();

//先建立连接
manager.create('ZS',iFrame.contentWindow).then(() => {
    console.log('ZS connect');
});

manager.create('LS',iFrame2.contentWindow).then(() => {
    console.log('LS connect');
});

//create前绑定也可以，每次create的时候会添加绑定
//未添加命名空间的，接收所有iframe发送的消息
manager.on('pang',function(payload){
    //payload.ns 返回是发送信息iframe对应的命名空间
    console.log('host on pang',payload);
    container.innerHTML += `<p>pang from ${payload.ns}: ${payload.data}</p>`;
    manager.send(`${payload.ns}:ping`,'ping');
});

//添加了命名空间的，只能接收到对应iframe发送的消息
manager.on('ZS:haha',function(payload){
    console.log('host on haha',payload);
    container.innerHTML += `<p>haha from ${payload.ns}: ${payload.data}</p>`;
});

//动态创建
let nsCount = 1;
document.getElementById('btn').addEventListener('click',function(){
    let iframe = document.createElement('iframe');
    iframe.src = './iframe2.html';
    document.body.appendChild(iframe);
    manager.create(`NS${nsCount}`,iframe.contentWindow).then(() => {
        console.log(`NS${nsCount} connect`);
    });
    nsCount++;
})

//销毁
document.getElementById('disconnect').addEventListener('click',function(){
    document.body.removeChild(iFrame);
    document.body.removeChild(iFrame2);
    // manager.disconnect('ZS');
    //也支持数组格式
    manager.disconnect(['ZS','LS']);
    console.log(manager);
})
