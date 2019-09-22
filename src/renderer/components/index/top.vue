<style lang="scss" scoped>
  #top {
    width: 100%;
    background: $titleColor;
    color: white;
    .center {
      height: 36px;
      line-height: 36px;
      &>ul {
        font-size: $assistSize;
        padding: 0 20px;
        &>li {
          float: left;
        }
      }
    }
  }
</style>

<template>
  <div id="top">
    <header class="center">
      <ul class="ys-fr ys-clearfix">
        <li>您好，671</li>
        <span class="ys-fl ys-mlr__10">|</span>
        <li v-if="!isActivate" class="ys-danger-color">未激活</li>
        <li v-else class="ys-success-color ys-cursor-pointer">2019-08-12 14:12:15 到期</li>
        <span class="ys-fl ys-mlr__10">|</span>
        <li @click="logout" class="ys-cursor-pointer">退出登錄</li>
      </ul>
    </header>
  </div>
</template>

<script>
  export default {
    name: 'top',
    data () {
      return {
        isActivate: true
      }
    },
    methods: {
      logout () {
        this.$router.push('/')
      }
    }
  }
</script>
