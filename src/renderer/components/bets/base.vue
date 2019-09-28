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
  <div id="bases">
    <div class="center ys-container">
      <h1>普通倍投</h1>
      <el-form label-width="80px" :model="betsFrom" :rules="betsRules" ref="betsFrom">
        <el-form-item label="下注期數" prop="bet_number">
          <el-input
            clearValidate
            v-model="betsFrom.bet_number"
            placeholder="請輸入下注期數，最多設置30期"
            type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="開始金額" prop="money">
          <el-input
            clearValidate
            v-model="betsFrom.money"
            placeholder="下注金額最低100且必須為整數"
            type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="下注方向" prop="buy_direction">
          <el-select placeholder="請選擇下注方向" v-model="betsFrom.buy_direction">
            <el-option label="漲" value="0"></el-option>
            <el-option label="跌" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="betsSubmit">立即提交</el-button>
          <router-link to="index" tag="el-button">返回首頁</router-link>
        </el-form-item>
      </el-form>
      <div class="tips">
        <h3>溫馨提示</h3>
        <p>1.下注期數為外掛啟動開始連續下注的期數；</p>
        <p>2.下注金額為下注多少期的金額；</p>
        <p>3.下注方向為下注多少期的方向；</p>
        <p>4.普通倍投方式為如若當前購買的期數不正確，下一期則為當前期數金額的3倍（如當前是100，則下一期為300），如果中獎之後則會重置為開始金額（如設置的開始金額為100，則下一期下注的金額為100）。</p>
      </div>
    </div>
  </div>
</template>

<script>
  import top from '@/components/index/top'

  export default {
    name: 'baseBet',
    data () {
      return {
        betsFrom: {
          bet_number: '',
          money: '',
          buy_direction: ''
        },
        betsRules: {
          bet_number: [
            { required: true, message: '請輸入下注期數', trigger: 'blur' },
            { pattern: /^[1-9]$|^[1-2][0-9]$|^30$/, message: '下注期數設置最多30期，請重新輸入', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '請輸入下注金額', trigger: 'blur' },
            { pattern: /^[1-9]\d{2,}$/, message: '下注金額設置有誤，請重新輸入', trigger: 'blur' }
          ],
          buy_direction: [
            { required: true, message: '下注方向不能為空', trigger: 'blur' }
          ]
        }
      }
    },
    components: { top },
    mounted () {
      this.init()
    },
    watch: {
      '$route' (val) {
        if (val.name === 'base') {
          this.init()
        }
      }
    },
    methods: {
      // 投注提交
      betsSubmit () {
        this.$refs['betsFrom'].validate((valid) => {
          if (valid) {
            let token = localStorage.getItem('__TOKEN__')
            if (token === null || token === 'null') {
              this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
            } else {
              localStorage.setItem(token + '_base', JSON.stringify(this.betsFrom))
              this.$message.success({ message: '數據設置成功', showClose: true })
            }
          } else {
            return false
          }
        })
      },

      // 初始化數據
      init () {
        this.$refs['betsFrom'].resetFields()
        let token = localStorage.getItem('__TOKEN__')

        if (token === null || token === 'null') {
          this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
        } else {
          let data = localStorage.getItem(token + '_base')
          if (data !== null && data !== 'null') {
            this.betsFrom = JSON.parse(data)
          }
        }
      }
    }
  }
</script>