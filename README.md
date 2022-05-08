# IFrameBridge
基于panta82 iframe_bridge的库进行了改造 [github](https://github.com/panta82/iframe_bridge)
> 有三种模式 
1. 被内嵌的iframe，使用EmbedBridge
2. 一次只对应一个内嵌的iframe，使用HostBridge
3. 要同时处理多个iframe，使用BridgeManager

安装:

```bash
npm install --save @okay/iframe-bridge
```

```javascript
import {HostBridge,EmbedBridge, BridgeManager} from '@okay/iframe-bridge';
```
### 参数
| key       | 默认值 |         描述 |      
| :--------- | :--: | :----------- 
| targetWindow     |  null  |     要连接的iframe的window，server为null | 
| origin   |  '*'  |   要连接的iframe的域名设置 | 
| handshake_interval |  200  | 多少毫秒间隔尝试一次握手 |
| handshake_timeout |  5000  | 握手超时时间 |
| queue_limit |  100  | 存储的最多消息数 |
| callback_timeout |  5000  | 请求超时时间 |

### 使用方式

只支持es6的import方式，demo需要运行在server环境下

使用案例(1对1):

(demo/host/index.html)

```html
<script src="./index.js" type="module"></script>

<iframe id="iframe" src="iframe.html"></iframe>

<script>
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
</script>
```

(iframe.html)

```html
<script src="../dist/main.js"></script>

<script>
	import { EmbedBridge } from '../../dist/main.js'
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
	
</script>
```

使用案例(1对n):

(demo/manager/index.html)

```html
<iframe src="./iframe.html" id="iframe" frameborder="0"></iframe>
<iframe src="./iframe2.html" id="iframe2" frameborder="0"></iframe>
<script src="./index.js" type="module"></script>
<script>
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
</script>
```

### License

MIT