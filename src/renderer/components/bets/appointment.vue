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
    <div class="center ys-container">
      <h1>預約下注</h1>
      <table class="ys-mb__10">
        <tr>
          <th>期數</th>
          <th>方向</th>
          <th>金額</th>
        </tr>
        <tr v-for="(item, index) in betsList" :key="index">
          <td>
            <el-input
              size="small"
              type="number"
              placeholder="1~288的期數"
              maxlength="3"
              v-model="item.bet_number">
            </el-input>
          </td>
          <td>
            <el-select size="small" v-model="item.buy_direction" placeholder="請選擇">
              <el-option label="漲" value="0"></el-option>
              <el-option label="跌" value="1"></el-option>
            </el-select>
          </td>
          <td>
            <el-input
              size="small"
              type="number"
              placeholder="請輸入金額"
              v-model="item.money">
            </el-input>
          </td>
        </tr>
      </table>
      <el-button type="primary" @click="betsSubmit">保存設定</el-button>
      <el-button @click="setBetsList">清空數據</el-button>
      <router-link to="index" tag="el-button">返回首頁</router-link>
      <div class="tips ys-mb__40">
        <h3>溫馨提示</h3>
        <p>1.可設定固定期數下注，啟動外掛后當前開獎期數與設定中的期數一致時將自動下注。</p>
        <p>2.期數的填寫為1-288的期數，必須按順序填寫，不必全部填寫。</p>
        <p>3.方向設置為你需要的下注方向漲或者跌。</p>
        <p>4.下注金額為下注多少期的金額。</p>
        <p>5.請保存設定操作后，再返回首頁進行啟動外掛。</p>
      </div>
    </div>
  </div>
</template>

<script>
  import top from '@/components/index/top'
  import { getMinMoney } from '@/fetch/common'

  export default {
    name: 'appointment',
    data () {
      return {
        betsList: []
      }
    },
    components: { top },
    mounted () {
      this.init()
    },
    watch: {
      '$route' (val) {
        if (val.name === 'appointment') {
          this.init()
        }
      }
    },
    methods: {
      // 設置表格數據
      setBetsList () {
        this.betsList = []
        for (let i = 0; i < 30; i++) {
          let obj = {
            bet_number: '',
            money: '',
            buy_direction: ''
          }

          this.betsList.push(obj)
        }
      },

      // 投注提交
      betsSubmit () {
        getMinMoney()
          .then(res => {
            if (res.code === 200) {
              for (let i in this.betsList) {
                if (this.betsList[i].bet_number !== '' &&
                  (this.betsList[i].bet_number < 1 || this.betsList[i].bet_number > 288)) {
                  this.$message({ type: 'warning', message: '期數必須為1-288期，請查詢錯誤', showClose: true })
                  return false
                }

                if (this.betsList[i].money !== '' &&
                  !/^[1-9]\d*$/.test(this.betsList[i].money)) {
                  this.$message({ type: 'warning', message: '金額必須為大於0的整數，請查詢錯誤', showClose: true })
                  return false
                }

                if (parseFloat(this.betsList[i].money) < parseFloat(res.min_money)) {
                  this.$message({ type: 'warning', message: '設置金額有誤，最低金額為：' + res.min_money, showClose: true })
                  return false
                }

                if (this.betsList[i].money !== '') {
                  if (this.betsList[i].buy_direction === '' ||
                    this.betsList[i].bet_number === '') {
                    this.$message({ type: 'warning', message: '設置有誤,必須設置整條數據', showClose: true })
                    return false
                  }
                }

                if (this.betsList[i].bet_number !== '') {
                  if (this.betsList[i].buy_direction === '' ||
                    this.betsList[i].money === '') {
                    this.$message({ type: 'warning', message: '設置有誤,必須設置整條數據', showClose: true })
                    return false
                  }
                }

                if (this.betsList[i].buy_direction !== '') {
                  if (this.betsList[i].bet_number === '' ||
                    this.betsList[i].money === '') {
                    this.$message({ type: 'warning', message: '設置有誤,必須設置整條數據', showClose: true })
                    return false
                  }
                }
              }

              // 判断是否出现重复期数
              for (let i in this.betsList) {
                for (let j in this.betsList) {
                  if (this.betsList[i].bet_number !== '') {
                    if (i !== j) {
                      if (this.betsList[i].bet_number === this.betsList[j].bet_number) {
                        this.$message({ type: 'warning', message: '不能出現重複的期數', showClose: true })
                        return false
                      }
                    }
                  }
                }
              }

              let token = localStorage.getItem('__TOKEN__')
              if (token === null || token === 'null') {
                this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
              } else {
                localStorage.setItem(token + '_appoinment', JSON.stringify(this.betsList))
                this.$message.success({ message: '數據設置成功', showClose: true })
              }
            }
          })
          .catch(err => {
            console.log(err)
            this.message({ type: 'warning', message: '設置普通倍投超時' })
          })
      },

      // 初始化數據
      init () {
        this.setBetsList()
        let token = localStorage.getItem('__TOKEN__')

        if (token === null || token === 'null') {
          this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
        } else {
          let data = localStorage.getItem(token + '_appoinment')
          if (data !== null && data !== 'null') {
            this.betsList = JSON.parse(data)
          }
        }
      }
    }
  }
</script>
