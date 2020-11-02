<template>
  <router-view></router-view>
</template>

<script>
import { computed, watch, ref, reactive } from 'vue'
import { useStore } from 'vuex'
export default {
  name: "App",
  setup(){}
};
</script>

<style>
  #app,
  body,
  html {
    height: 100%;
  }
</style>
