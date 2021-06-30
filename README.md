# IFrameBridge
基于panta82 iframe_bridge的库进行了改造 [github](https://github.com/panta82/iframe_bridge)

#### 增加了2个场景的支持
+ 增加一个iframe为发布者，不同的iframe为订阅者，实现了基于命名空间的订阅发布
+ 增加了fetch的场景，如果调用异步请求，多次调用的匹配
