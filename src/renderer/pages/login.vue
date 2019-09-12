<style lang="scss" scoped>
  #login {
    text-align: center;
    .center {
      background: url('/static/img/background.jpg') no-repeat;
      background-size: cover;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .box {
        width: 320px;
        height: 300px;
        background: white;
        margin: 80px auto;
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
      <div class="box">
        <h1 class="title">輔助登錄</h1>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              placeholder="請輸入登錄賬號"
              v-model="loginForm.username"
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
          <el-form-item class="code" prop="code">
            <el-input
              placeholder="請輸入驗證碼"
              v-model="loginForm.code"
              clear>
            </el-input>
            <div class="code-img" @click="codeChange">
              <img src="http://www.xiaobaixitong.com/d/file/help/2018-08-06/f15ce5d652d8da38e9e0e384f35b39d7.png" alt="驗證碼">
            </div>
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
  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          username: '',
          password: '',
          code: ''
        },
        loginRules: {
          username: [
            { required: true, message: '登錄賬號不能為空', trigger: 'blur' },
            { min: 6, message: '登錄賬號不能少於6位數', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '登錄密碼不能為空', trigger: 'blur' },
            { min: 6, message: '登錄密碼格式錯誤', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '驗證碼不能為空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 登錄提交
      loginSumit (loginForm) {
        this.$refs[loginForm].validate((valid) => {
          if (valid) {
            this.$router.push('/index')
            return valid
          } else {
            return false
          }
        })
      },

      // 驗證碼更換
      codeChange () {
        console.log('驗證碼更換')
      }
    }
  }
</script>