# vue3-antd-system


思路：
### 多级菜单只展开一个
通过监听路由切换，有切换时判断当前路由，判断是否有children，有的话获取所有path，否则拿第一个path的值