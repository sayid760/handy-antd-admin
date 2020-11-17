
# vue3-antd-system
该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统开发。基于vue3，使用vite脚手架，引用Ant组件库，方便开发快速简洁好看的组件。轻量级，适合扩展配置


## 使用
```js
npm install 
npm run dev
```

## 总结
1. vite版本的.vue页面中使用不了import path from 'path'，提示没有'default'，也不能用require； </br>
大概都是因为这些npm包都是module.export出来的，没有弄成umd规范</br>
Mockjs也是一样不能使用，它的使用有commonjs、AMD、CMD，唯独没有es module</br>
可以下载下来，使用tsc转成es module规范使用
```js
// 想到的方法是，自己下载一份，改下
exports['default'] = Mockjs
```
2. 多级菜单只展开一个 </br>
通过监听路由切换，有切换时判断当前路由，判断是否有children，有的话获取所有path，否则拿第一个path的值
3. echart在dom加载完才渲染
```js
mounted() {
    this.$nextTick(() => {
        drawLine();
    });
}
```
4. echarts超出容器宽度问题的解决办法
```js
onMounted(()=>{
    window.addEventListener('resize', ()=>{
        chart.resize()
    })
    // 手动触发resize
    setTimeout(()=>{
        dispatchEvent(new Event('resize'))
    })
})
```
或者在全局中触发resize
```js
// main.ts
Vue.prototype.resize = function () {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    window.dispatchEvent(event)
  } else if (document.createEventObject) {
    window.fireEvent('onresize')
  }
}
```