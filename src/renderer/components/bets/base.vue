<style lang="scss" scoped>
  @import '@/assets/scss/bets/style.scss';
  .input-money {
    width: 80px;
    display: inline-block;
    margin-right: 5px;
    @for $i from 3 through 30 {
      margin-top: 5px;
    }
  }
  .el-button+.el-button {
    margin-left: 0 !important;
  }
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
        <el-form-item label="預警期數" prop="bet_number">
          <el-input
            clearValidate
            v-model="betsFrom.bet_number"
            placeholder="請輸入下注期數，最多設置30期"
            type="number">
          </el-input>
        </el-form-item>
        <el-form-item label="下注方向" prop="buy_direction">
          <el-select placeholder="請選擇下注方向" v-model="betsFrom.buy_direction">
            <el-option label="漲" value="0"></el-option>
            <el-option label="跌" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下注金額" prop="money">
          <div class="input-money" v-for="(item, index) in betsFrom.moneyList">
            <el-input
              clearValidate
              v-model="item.money"
              :placeholder="'第'+(index+1)+'注'"
              type="text">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="betsSubmit">保存設定</el-button>
          <el-button @click="buildMoneyList">清空數據</el-button>
          <router-link to="index" tag="el-button">返回首頁</router-link>
        </el-form-item>
      </el-form>
      <div class="tips ys-mb__40">
        <h3>溫馨提示</h3>
        <p>1.設定固定下注的方向，無論下注是否中獎每一期都是固定購買一個方向。</p>
        <p>2.設定每一期的下注金額，無論中途哪一注中獎后都會返回第一注的金額下注。</p>
        <p>3.請保存設定操作后，再返回首頁進行啟動外掛。</p>
      </div>
    </div>
  </div>
</template>

<script>
  import top from '@/components/index/top'
  import { getMinMoney } from '@/fetch/common'

  export default {
    name: 'baseBet',
    data () {
      return {
        betsFrom: {
          bet_number: '',
          moneyList: '',
          buy_direction: ''
        },
        betsRules: {
          bet_number: [
            { required: true, message: '請輸入下注期數', trigger: 'blur' }
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
        getMinMoney()
          .then(res => {
            if (res.code === 200) {
              for (let i in this.betsFrom.moneyList) {
                if (this.betsFrom.moneyList[i].money !== '' &&
                  !/^[1-9]\d*$/.test(this.betsFrom.moneyList[i].money)) {
                  this.$message({ type: 'warning', message: '金額必須為大於0的整數，請修改錯誤', showClose: true })
                  return false
                }

                if (parseFloat(this.betsFrom.moneyList[i].money) < parseFloat(res.min_money)) {
                  this.$message({ type: 'warning', message: '設置金額有誤，最低金額為：' + res.min_money, showClose: true })
                  return false
                }

                if (this.betsFrom.moneyList[i].money === '') {
                  for (let j = i; j < this.betsFrom.moneyList.length; j++) {
                    if (this.betsFrom.moneyList[j].money !== '') {
                      this.$message({ type: 'warning', message: '數據設置有誤，必須按順序設置數據', showClose: true })
                      return false
                    }
                  }
                }
              }

              if (parseInt(this.betsFrom.bet_number) < 1 ||
                parseInt(this.betsFrom.bet_number) > 288) {
                this.$message({ type: 'warning', message: '設定期數必須在1-288之間', showClose: true })
                return false
              }

              this.$refs['betsFrom'].validate((valid) => {
                if (valid) {
                  this.betsFrom.moneyList = this.betsFrom.moneyList
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
            }
          })
          .catch(err => {
            console.log(err)
            this.message({ type: 'warning', message: '設置普通倍投超時' })
          })
      },

      // 初始化數據
      init () {
        this.buildMoneyList()
        let token = localStorage.getItem('__TOKEN__')

        if (token === null || token === 'null') {
          this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
        } else {
          let data = localStorage.getItem(token + '_base')
          if (data !== null && data !== 'null') {
            this.betsFrom = JSON.parse(data)
          }
        }
      },

      // 创建moneyList
      buildMoneyList () {
        this.betsFrom.moneyList = []
        this.betsFrom.bet_number = ''
        this.betsFrom.buy_direction = ''
        for (let i = 0; i < 30; i++) {
          let obj = { money: '' }
          this.betsFrom.moneyList.push(obj)
        }
      }
    }
  }
</script>