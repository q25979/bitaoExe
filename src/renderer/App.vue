<template>
  <div id="app">
    <top v-if="$route.meta.top"></top>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import top from '@/components/index/top'

  export default {
    name: 'bitao-assist',
    created () {
    },
    components: { top }
  }
</script>

<style>
  /* CSS */
</style>
