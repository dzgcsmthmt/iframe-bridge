import {EmbedBridge} from '../../dist/main.js'
const container = document.getElementById('container');
let count = 1;

//使用方法
let bridgeInstance = new EmbedBridge();
//建立连接
bridgeInstance.connect().then(() => {
    console.log('embed connected');
    //发送消息
    bridgeInstance.send('pang','pangdgsfs');
});
//绑定事件
bridgeInstance.on('ping',function(payload){
    console.log('embed on ping',payload);
    container.innerHTML += '<p>ping: ' + payload.data + '</p>'
    setTimeout(() => {bridgeInstance.send('test',11111);},1000);
});

//fetch，发送同一个请求，需要匹配处理的情况
// 可以添加拦截器 request response（参考axios用法） 
bridgeInstance.interceptors.request.use(data => Object.assign(data,{data:{count:data.data.count + 5}}));

for(let i = 1;i <= 5;i++){
    setTimeout(() => {
        bridgeInstance.fetch('count',{count: count++}).then((data) => {
            console.log('fetch response data',data);
        },(error) => {
            console.log(error);
        })
    },5000 * Math.random());
} 


/* //取消未返回状态的发送
let cancel;
bridgeInstance.fetch('cancelTest',{count: count++},(c) => {console.log('c',c),cancel = c}).then((data) => {
    console.log('data',data);
},(error) => {
    console.log(error);
})
setTimeout(() => {
    cancel();
},1000); */