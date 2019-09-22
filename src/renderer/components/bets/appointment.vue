<style lang="scss" scoped>
  @import '@/assets/scss/bets/style.scss';
</style>
<style lang="scss">
  .el-select-dropdown {
    .el-select-dropdown__item {
      padding: 0 20px;
    }
  }
</style>

<template>
  <div id="appointment">
    <top></top>
    <div class="center ys-container">
      <h1>預約下注</h1>
      <el-form label-width="80px" :model="betsFrom" :rules="betsRules" ref="betsFrom">
        <el-form-item label="下注期數" prop="bet_number">
          <el-input
            clearValidate
            v-model="betsFrom.bet_number"
            placeholder="請輸入下注期數，最多設置30期"
            type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="下注金額" prop="money">
          <el-input
            clearValidate
            v-model="betsFrom.money"
            placeholder="下注金額最低100且必須為整數"
            type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="下注方向" prop="direction">
          <el-select placeholder="請選擇下注方向" v-model="betsFrom.direction">
            <el-option label="漲" value="0"></el-option>
            <el-option label="跌" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="betsSubmit">立即提交</el-button>
          <router-link to="index" tag="el-button">返回首頁</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import top from '@/components/index/top'

  export default {
    name: 'appointment',
    data () {
      return {
        betsFrom: {
          bet_number: '',
          money: '',
          direction: ''
        },
        betsRules: {
          bet_number: [
            { required: true, message: '請輸入下注期數', trigger: 'blur' },
            { pattern: /^[1-9]$|^[1-2][0-9]$|30/, message: '下注期數設置有誤，請重新輸入', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '請輸入下注金額', trigger: 'blur' },
            { pattern: /^[1-9]\d{2,}$/, message: '下注金額設置有誤，請重新輸入', trigger: 'blur' }
          ],
          direction: [
            { required: true, message: '下注方向不能為空', trigger: 'blur' }
          ]
        }
      }
    },
    components: { top },
    created () {
      console.log(this.$route)
    },
    methods: {
      // 投注提交
      betsSubmit () {
        this.$refs['betsFrom'].validate((valid) => {
          if (valid) {
            console.log('提交')
          } else {
            return false
          }
        })
      }
    }
  }
</script>