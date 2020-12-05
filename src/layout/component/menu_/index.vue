<template>
  <div id="menu">
    <a-menu
      :openKeys="openKey"
      :selectedKeys="selectKey"
      :mode="menuModel"
      :theme="theme"
      @openChange="openChange"
    >
      <sub-menu
        v-for="(route) in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </a-menu>
  </div>
</template>
<script>
import { computed, watch, getCurrentInstance, onMounted, reactive, ref, toRefs, toRef, isRef, unref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "vuex";
import SubMenu from "./SubMenu.vue";
import { genPath } from '/@/utils'
import { routes } from '/@/router/routes'

export default {
  components: {
    SubMenu,
  },
  setup() {
    const { getters, commit } = useStore();
    const { ctx } = getCurrentInstance();
    const route = useRoute();
    // const routes = computed(() => ctx.$root.$router.options.routes)

    const state = reactive({
      lastOpenKey: null,
      openKey: computed(() => getters.openKey),
      selectKey: computed(() => {
        console.log('getters.selectKey~~~~~~~~~~~~~~~', getters.selectKey)
        return getters.selectKey
      }),
      openk:null
    })

    const menuModel = computed(() => getters.menuModel);
    const theme = computed(() => getters.theme);

     // 获取打开的子菜单
    const genParentPath = () =>{
      var firstString = route.path.split('/')[1]; 
      // console.log(firstString)
      // const index = route.path.indexOf("/");
      // const lastOpenKey = toRef(state, "latestOpenKey") 
      // return route.meta.isGroup ? [...(route.matched.slice(0, 3).map(item => item.path)), lastOpenKey.value] : [route.matched[0].path]
      return genPath(route.matched, '/'+firstString)
    }

    const openChange = (openKeys) => {
      state.latestOpenKey = openKeys.find(key => state.openKey.indexOf(key) === -1);
      commit("layout/updateOpenKey", openKeys);
    };

    onMounted(()=>{
        const index = route.path.lastIndexOf("/");
        const pre = route.path.substring(0, index);
        const end = (route.meta.onlyOne&&route.meta.onlyOne)? route.path.substring(index, route.path.length):route.path.substring(index + 1, route.path.length) 
        let arr = genParentPath()
        console.log(arr)
        commit("layout/updateOpenKey", arr);
        commit("layout/selectKey", end);
    })
   
    watch(() => route.fullPath, () => {
      let arr = genParentPath()
      commit("layout/updateOpenKey", arr);
    })

    return {
      ...toRefs(state),
      routes,
      menuModel,
      theme,
      openChange,
    };
  },
};
</script>
<style>
.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 48px;
  line-height: 48px;
}
.ant-menu-vertical > .ant-menu-item,
.ant-menu-vertical-left > .ant-menu-item,
.ant-menu-vertical-right > .ant-menu-item,
.ant-menu-inline > .ant-menu-item,
.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 48px !important;
  line-height: 48px !important;
}
.ant-layout-sider {
  background: #191a23 !important;
}
.ant-menu-dark,
.ant-menu-dark {
  background: #191a23 !important;
}
.ant-menu-dark .ant-menu-inline.ant-menu-sub {
  background-color: #101117 !important;
}
.ant-menu-vertical .ant-menu-item,
.ant-menu-vertical-left .ant-menu-item,
.ant-menu-vertical-right .ant-menu-item,
.ant-menu-inline .ant-menu-item,
.ant-menu-vertical .ant-menu-submenu-title,
.ant-menu-vertical-left .ant-menu-submenu-title,
.ant-menu-vertical-right .ant-menu-submenu-title,
.ant-menu-inline .ant-menu-submenu-title {
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}

</style>
