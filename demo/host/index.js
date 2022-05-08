import {HostBridge} from '../../dist/main.js'
const container = document.getElementById('container');
const iFrame = document.getElementById('iframe');
const loadIframe = document.getElementById('load');
const disconnectIframe = document.getElementById('disconnect');
const destroyBridge = document.getElementById('destroy');
let count = 0;

//使用方法
let bridge = new HostBridge({targetWindow: iFrame.contentWindow});
//先建立连接
bridge.connect().then(() => {
    console.log('host connect');
    setTimeout(() => {bridge.send('ping',count++);},3000);
    //连接成功后绑定事件
    bridge.on('test',function(payload){
        console.log('host on payload',payload);
        container.innerHTML += '<p>test: ' + payload.data + '</p>';
    });
});
//发送消息，也可以使用postMessage（别名）
//建立连接前发送的信息先加入一个队列中，连接成功后清空队列
bridge.send('ping',count++);
//绑定事件，可以建立连接后再绑定，也可以直接绑定
bridge.on('pang',function(payload){
    console.log('host on pang',payload);
    container.innerHTML += '<p>pang: ' + payload.data + '</p>';
});

//处理内嵌iframe的fetch情况，返回callbackId
bridge.on('count',function(payload){
    console.log('host on fetch',payload);
    setTimeout(() => {
        bridge.send('cb',{callbackId: payload.__callbackId__,data: {code:0,msg:'',data:payload.data.count}});
    },8000 * Math.random())
});

//如果只是iframe替换，所有的协议都要复用，使用setTargetWindow
loadIframe.addEventListener('click',function(){
    document.body.removeChild(iFrame);
    let oIframe = document.createElement('iframe');
    oIframe.src = "./iframe.html";
    document.body.appendChild(oIframe);
    bridge.setTargetWindow(oIframe.contentWindow).then(() => {
        bridge.send('ping',count++);
    })
})

//销毁Iframe，取消连接，内存回收 这个取消window引用
disconnectIframe.addEventListener('click',function(){
    document.body.removeChild(iFrame);
    bridge.disconnect();
    console.log('disconnectIframe',bridge);
})

//不使用的bridge，手工调用destroy方法，防止内存泄漏 这个是取消事件绑定
destroyBridge.addEventListener('click',function(){
    bridge.destroy();
    console.log('destroyBridge',bridge);
    bridge = null;
})

