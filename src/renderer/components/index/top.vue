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
        <li>您好，{{username}}</li>
        <span class="ys-fl ys-mlr__10">|</span>
        <li v-if="!isActivate" class="ys-danger-color">{{time}}</li>
        <li v-else class="ys-success-color ys-cursor-pointer">{{time}} 到期</li>
        <span class="ys-fl ys-mlr__10">|</span>
        <li @click="logoutClick" class="ys-cursor-pointer">退出登錄</li>
      </ul>
    </header>
  </div>
</template>

<script>
  import { getUserInfo, logout } from '@/fetch/common.js'

  export default {
    name: 'top',
    data () {
      return {
        isActivate: true,
        time: '',
        username: ''
      }
    },
    created () {
      clearInterval(this.timer)
      this.getInfo()
      this.timer = setInterval(this.getInfo, 1000 * 5)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      // 註銷
      logoutClick () {
        this.$confirm('確定退出賬號？', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          logout()
            .then(res => {
              if (res.code === 200) {
                this.$store.dispatch('updateStartStatus', false)
                localStorage.removeItem('__TOKEN__')
                this.$router.push('/')
              } else {
                this.$message({ type: 'warning', message: res.msg })
              }
            })
            .catch((err) => {
              console.log(err)
              this.$message({ type: 'warning', message: '登出超時' })
            })
        }).catch(() => {})
      },

      // 獲取用戶信息
      getInfo () {
        getUserInfo()
          .then(res => {
            if (res.code === 200) {
              this.time = res.time
              this.isActivate = res.activate
              this.username = res.user_name
            } else {
              logout()
                .then(res => {
                  this.$message({ type: 'warning', message: '登錄狀態不存在，請重新登錄', showClose: true })
                  this.$store.dispatch('updateStartStatus', false)
                  localStorage.removeItem('__TOKEN__')
                  this.$router.push('/')
                })
                .catch((err) => {
                  console.log(err)
                  this.$message({ type: 'warning', message: '登出超時' })
                })
            }
          })
          .catch(err => {
            console.log('err:', err)
          })
      }
    }
  }
</script>
