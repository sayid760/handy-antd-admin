
# vue3-antd-system
该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统开发。基于vue3，使用vite脚手架，引用Ant组件库，方便开发快速简洁好看的组件。轻量级，适合扩展配置


## 使用
```js
npm install 
npm run dev
```

## 总结
1. vite版本的.vue页面中使用不了import path from 'path'，没有'default'，也不能用require
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
        manipulateChart('resize')
    })
    //  解决全部echart超出容器宽度问题
    setTimeout(()=>{
        dispatchEvent(new Event('resize'))
    })
})
```