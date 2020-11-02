# vue3-antd-system
```js
npm install 
npm run dev
```


## 总结
1. vite版本的.vue页面中使用不了import path from 'path'，没有'default'，也不能用require
2. 多级菜单只展开一个 </br>
通过监听路由切换，有切换时判断当前路由，判断是否有children，有的话获取所有path，否则拿第一个path的值