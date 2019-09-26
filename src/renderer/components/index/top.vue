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
        <li v-if="!isActivate" class="ys-danger-color">{{time}}</li>
        <li v-else class="ys-success-color ys-cursor-pointer">{{time}} 到期</li>
        <span class="ys-fl ys-mlr__10">|</span>
        <li @click="logout" class="ys-cursor-pointer">退出登錄</li>
      </ul>
    </header>
  </div>
</template>

<script>
  import { getUserInfo } from '@/fetch/common.js'

  export default {
    name: 'top',
    data () {
      return {
        isActivate: true,
        time: ''
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      // 註銷
      logout () {
        this.$confirm('確定退出賬號？', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('updateStartStatus', false)
          localStorage.removeItem('__TOKEN__')
          this.$router.push('/')
        }).catch(() => {})
      },

      // 獲取用戶信息
      getInfo () {
        getUserInfo()
          .then(res => {
            this.time = res.time
            this.isActivate = res.activate
          })
          .catch(err => {
            console.log('err:', err)
            this.$message({ type: 'warning', message: '獲取用戶信息失敗，請聯繫客服' })
          })
      }
    }
  }
</script>
