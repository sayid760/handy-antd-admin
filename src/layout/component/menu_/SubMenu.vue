<template>
  <template v-if="!item.hidden">
    <!-- if item.children is not null 渲染 a-sub-menu -->
    <a-sub-menu
      :key="item.path"
      v-if="item.children && item.children.length > 0"
    >
      <template v-slot:title>
        <span>
          <MenuIcon/>
          <span>{{ item.meta.title }}</span>
        </span>
      </template>
      <!-- 递归 item.children -->
      <sub-menu
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </a-sub-menu>
    <!-- if item.chilren is null 渲染 a-menu-item -->
    <a-menu-item v-bind="$attrs" :key="item.path" v-else>
      <router-link
        :to="resolvePath(item.path, true)"
        @click="
          clickMenuItem(
            item.path,
            item.meta.title,
            resolvePath(item.path, true)
          )
        "
      >
        <MenuIcon />
        <span>{{ item.meta.title }}</span>
      </router-link>
    </a-menu-item>
  </template>
</template>

<script lang='ts'>
// import { path } from "path";
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router'
import * as Icons from "@ant-design/icons-vue";
export default {
  name: "SubMenu",
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { commit } = useStore();
    const route = useRoute();

    // 菜单单击触发函数
    const clickMenuItem = function (key, title, path) { 
      console.log('---------------->', key, title, path)
      // commit("layout/updateOpenKey", route.matched[0].path);
      commit("layout/addTab", { key, title, path }); // 新增顶部选项卡操作
      commit("layout/selectKey", key); // 设置当前菜单选中
    };

    const resolvePath = (routePath, single) => {
      if (/^(https?:|mailto:|tel:)/.test(routePath)) {
        return routePath;
      }
      if (single) {
        return props.basePath;
      }
      //这里需要处理一下
      return props.basePath=='/'?props.basePath + routePath:props.basePath + '/' + routePath;
      // return path.resolve(props.basePath, routePath);
    };
    const MenuIcon = Icons[(props.item.meta || {}).icon] || {};
    return {
      clickMenuItem,
      resolvePath,
      MenuIcon,
    };
  },
};
</script>
