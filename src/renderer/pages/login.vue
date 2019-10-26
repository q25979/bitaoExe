<style lang="scss" scoped>
  #login {
    text-align: center;
    .center {
      background: url('../assets/img/background.jpg') no-repeat;
      background-size: cover;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .tips {
        width: 385px;
        color: red;
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
        font-size: 16px;
        p {
          margin: 0;
        }
      }
      .box {
        width: 320px;
        height: 250px;
        background: white;
        margin: 120px auto;
        border-radius: 5px;
        padding: 30px;
        .title {
          color: #333;
          font-size: 18px;
          margin: 20px;
        }
        .login-btn {
          width: 100%;
        }
        .code {
          .code-img {
            width: 35%;
            height: 38px;
            border-radius: 5px;
            float: right;
            overflow: hidden;
            cursor: pointer;
            border: $border;
            &>img {
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .code {
    .el-input {
      width: 60%;
      float: left;
    }
  }
</style>

<template>
  <div id="login">
    <div class="center ys-container">
      <div class="tips">溫馨提示：
        <p>為保證下注期數與官方實時同步，請每次更換下注模式都必須退出賬戶開關程序，重新在桌面打開進行操作！</p>
      </div>
      <div class="box" v-loading="loading">
        <h1 class="title">輔助登錄</h1>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
          <el-form-item prop="email">
            <el-input
              placeholder="請輸入登錄賬號"
              v-model="loginForm.email"
              clear>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="請輸入登錄密碼"
              v-model="loginForm.password"
              type="password"
              clear>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="loginSumit('loginForm')"
              type="primary"
              class="login-btn">
              登錄系統
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '@/fetch/common.js'
  import mac from 'getmac'

  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          email: '',
          password: ''
        },
        loading: false,
        loginRules: {
          email: [
            { required: true, message: '登錄賬號不能為空', trigger: 'blur' },
            { min: 6, message: '登錄賬號不能少於6位數', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '登錄密碼不能為空', trigger: 'blur' },
            { min: 6, message: '登錄密碼格式錯誤', trigger: 'blur' }
          ]
        },
        macAddress: ''
      }
    },
    components: {
    },
    created () {
      this.isToken()
    },
    methods: {
      // 登錄提交
      loginSumit (loginForm) {
        this.$refs[loginForm].validate((valid) => {
          if (valid) {
            this.loading = true
            this.getMacAddress(mac => {
              this.loginForm.login_dev = mac
              login(this.loginForm)
                .then(res => {
                  this.loading = false
                  if (res.code === 200) {
                    this.$message({ type: 'success', message: res.msg, showClose: true })
                    localStorage.setItem('__TOKEN__', res.token)
                    this.$router.push('/index')
                  } else {
                    this.$message({ type: 'warning', message: res.msg, showClose: true })
                  }
                })
                .catch(err => {
                  console.log('err:', err)
                  this.$message.error('網絡超時，請檢查您的網絡狀態')
                  this.loading = false
                })
            })

            return valid
          } else {
            return false
          }
        })
      },

      getMacAddress (callback) {
        mac.getMac((err, macAddress) => {
          if (err) throw err
          this.macAddress = macAddress
          callback(macAddress)
        })
      },

      // 驗證碼更換
      codeChange () {
        console.log('驗證碼更換')
      },

      // 判断是否存在 TOKEN
      isToken () {
        let token = localStorage.getItem('__TOKEN__')
        if (token !== null && token !== 'null') {
          this.$router.push('/index')
        }
      }
    }
  }
</script>
