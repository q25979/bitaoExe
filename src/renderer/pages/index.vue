<style lang="scss" scoped>
  #index {
    .center {
      padding: 10px;
      .bets-record {
        .title {
          height: 20px;
          line-height: 20px;
          border: $border;
          border-color: #EBEEF5;
          border-bottom: 0;
          &>ul {
            font-size: 12px;
            &>li {
              float: left;
            }
            &>span {
              margin: 0 5px;
              float: left;
            }
          }
        }
      }
      .assist-box {
        width: 115px;
        position: absolute;
        top: 88px;
        left: 10px;
        z-index: 1;
        border: 1px solid #DCDFE6;
        background: white;
        text-align: center;
        border-radius: 4px;
        ul {
          li {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            &:nth-child(2) {
              padding: 0;
            }
            &:hover {
              color: white;
              background: #E6A23C;
            }
          }
        }
      }
      .tips {
        margin-top: 10px;
        color: #353535;
        margin-left: 10px;
      }
    }
  }
</style>

<template>
  <div id="index">
    <top></top>
    <div class="center ys-container">
      <div class="function-btn ys-mb__10">
        <el-button
          :type="$store.state.status.isStart?'danger':'success'"
          event.cancelBubble="true"
          @click="start">
          <i :class="$store.state.status.isStart?'el-icon-video-pause':'el-icon-video-play'" class="ys-mr__5"></i>{{startText}}
        </el-button>
        <router-link tag="el-button" to="/appointment">預約下注</router-link>
        <router-link tag="el-button" to="/early">預警倍投</router-link>
        <router-link tag="el-button" to="/base">普通倍投</router-link>
        <el-button @click="getHistory">刷新數據</el-button>
      </div>
      <div class="assist-box" v-if="startStatus">
        <ul>
          <li @click="startList(1)">預約下注</li>
          <li @click="startList(2)">預警倍投</li>
          <li @click="startList(3)">普通倍投</li>
        </ul>
      </div>
      <div class="bets-record">
        <div class="title ys-p__10">
          <span class="ys-bold">下注記錄</span>
          <ul class="ys-fr ys-clearfix">
            <li>賬戶餘額：<span class="ys_dangerColor">{{parseFloat(balance).toFixed(2)}}</span></li>
            <span>|</span>
            <li>獲取利潤：<span class="ys_successColor">{{parseFloat(amt).toFixed(2)}}</span></li>
            <span>|</span>
            <li>當前期數：{{curnumber}}</li>
            <span>|</span>
            <li>下注金額：{{curdata.money}}</li>
            <span>|</span>
            <li>下注方向：{{curdata.buy_direction_name}}</li>
          </ul>
        </div>
        <el-table
          :data="betsList"
          border
          size="small"
          style="width: 100%"
          height="350px">
          <el-table-column
            prop="buy_number"
            align="center"
            label="期號">
          </el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="金額">
          </el-table-column>
          <el-table-column
            prop="buy_direction_name"
            align="center"
            label="方向">
          </el-table-column>
          <el-table-column
            prop="last_direction_name"
            align="center"
            label="開獎">
          </el-table-column>
          <el-table-column
            prop="buy_time"
            align="center"
            label="下注時間">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="optionData.page"
            :page-sizes="[30, 60, 90, 300]"
            :page-size="optionData.limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
      <div class="tips">{{tips}}</div>
    </div>
  </div>
</template>

<script>
  import {
    getDealLog,
    betOrder,
    getFiveLog,
    getOpenLog,
    getTips
  } from '@/fetch/common.js'

  export default {
    name: 'index',
    data () {
      return {
        startText: '啟動外掛',
        startType: 1,
        startStatus: false,
        betsList: [],
        optionData: {
          page: 1,
          limit: 30
        },
        total: 0,
        amt: 0,
        curdata: {
          money: '0.00',
          buy_direction_name: '无'
        },
        balance: 0,
        curnumber: 0,
        betData: {},
        betBaseIndex: 0,
        betEarlyIndex: 0,
        betEarlyStart: false,
        betEarlyDirection: 0,
        timer: null,
        orderTimer: null,
        tips: ''
      }
    },
    components: {},
    created () {
      this.getTipsInfo()
      this.init()
    },
    watch: {
      '$route' (val) {
        if (val.name === 'index') {
          this.init()
        } else {
          clearInterval(this.orderTimer)
        }
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
      clearInterval(this.orderTimer)
    },
    methods: {
      // 初始化
      init () {
        clearInterval(this.timer)
        this.$store.dispatch('updateStartStatus', false)
        this.startText = '啟動外掛'
        clearInterval(this.orderTimer)
        this.getHistory()
        this.orderTimer = setInterval(this.getHistory, 1000 * 60 * 2)

        document.body.onclick = () => {
          this.startStatus = false
        }
      },

      // 獲取提示信息
      getTipsInfo () {
        getTips()
          .then(res => {
            this.tips = res.tips
          })
          .catch(err => {
            console.log('獲取提示:', err)
          })
      },

      // 獲取交易記錄
      getHistory () {
        getDealLog(this.optionData)
          .then(res => {
            if (res.code === 0) {
              this.betsList = res.data
              this.total = parseInt(res.count)
              this.amt = res.amt
              this.balance = res.balance
              this.curdata = res.curdata
              this.curnumber = res.curnumber
            } else {
              this.$mesage({ type: 'warning', message: res.msg })
            }
          })
          .catch(err => {
            console.log('err:', err)
          })
      },

      // 表格事件
      sizeChange (val) {
        this.optionData.limit = val
        this.optionData.page = 1
        this.getHistory()
      },

      currentChange (val) {
        this.optionData.page = val
        this.getHistory()
      },

      // 啟動外掛
      start (event) {
        event.stopPropagation()

        var bStart = this.$store.state.status.isStart
        if (bStart) {
          this.$confirm('確認停止外掛?', '提示', {
            confirmButtonText: '確認'
          }).then(() => {
            this.init()
          }).catch(() => {})
        } else {
          this.startStatus = !this.startStatus
        }
      },

      startList (index) {
        this.startStatus = false
        this.startType = index

        if (index === 1) {
          this.startText = '預約下注運行中...'
        } else if (index === 2) {
          this.startText = '預警倍投運行中...'
        } else if (index === 3) {
          this.startText = '普通倍投運行中...'
        }
        this.$store.dispatch('updateStartStatus', true)
        this.betOrders()
      },

      // 投注
      betOrders () {
        let token = localStorage.getItem('__TOKEN__')
        var name = ''
        var message = ''

        if (token === null || token === 'null') {
          this.$message({ type: 'warning', message: '登錄狀態不存在，請登錄賬號再進行操作', showClose: true })
        } else {
          if (this.startType === 1) {
            // 預約下注
            name = '_appoinment'
            message = '預約下注'
          } else if (this.startType === 2) {
            // 預警倍投
            name = '_early'
            message = '預警倍投'
          } else if (this.startType === 3) {
            // 普通倍投
            name = '_base'
            message = '普通倍投'
          }
        }

        let data = localStorage.getItem(token + name)
        if (data === null || data === 'null') {
          this.$message({ type: 'warning', message: message + '未設定金額，暫停輔助', showClose: true })
        } else {
          try {
            this.betData = JSON.parse(data)
          } catch (err) {
            this.$message({ type: 'warning', message: message + '未設定金額，暫停輔助', showClose: true })
            return 0
          }
        }
        this.betConfirm()
      },

      // 確認投注
      betConfirm () {
        // 5分鐘一次
        clearInterval(this.timer)
        this.timerFunc()
        this.timer = setInterval(this.timerFunc, 1000 * 5 * 60)
      },

      // 延時函數
      timerFunc () {
        if (this.startType === 2) {
          // 預警倍投
          this.earlyBet()
        } else if (this.startType === 3) {
          // 普通倍投
          this.baseBet()
        } else {
          // 預約下注
          this.appointmentBet()
        }
      },

      // 預約投注
      appointmentBet () {
        for (let i in this.betData) {
          if (this.betData[i].bet_number !== '' &&
            this.betData[i].buy_direction !== '' &&
            this.betData[i].money !== '') {
            if (parseInt(this.curnumber) === parseInt(this.betData[i].bet_number)) {
              this.betRequset(this.betData[i])
            }
          }
        }
      },

      // 普通倍投
      baseBet () {
        if (parseInt(this.curnumber) < parseInt(this.betData.bet_number)) {
          return false
        }

        if (this.betData.moneyList[0].money === '') {
          this.$alert('請先設置普通倍投金額', '消息提示', { type: 'warning' })
          this.init()
        }

        if (this.betData.moneyList[this.betBaseIndex].money === '') {
          this.betBaseIndex = 0
        }

        var betData = this.betData
        betData.bet_number = this.curnumber
        betData.money = this.betData.moneyList[this.betBaseIndex].money

        if (this.betBaseIndex === 0) {
          this.betRequset(betData, res => {
            this.betBaseIndex++
          })
        } else {
          this.getFiveInfo(res => {
            if (res.data.length > 0) {
              if (parseInt(res.data[0].last_money) > 0) {
                this.betBaseIndex = 0
              }
              this.betRequset(betData, res => {
                this.betBaseIndex++
              })
            } else {
              this.betBaseIndex = 0
              this.betRequset(betData, res => {
                this.betBaseIndex++
              })
            }
          })
        }
      },

      // 預警倍投
      earlyBet () {
        var limit = { limit: this.betData.early }
        var betData = { bet_number: this.curnumber }

        if (this.betData.moneyList[0].money === '') {
          this.$alert('請先設置預警倍投金額', '消息提示', { type: 'warning' })
          this.init()
        }

        if (this.betData.moneyList[this.betBaseIndex].money === '') {
          this.betBaseIndex = 0
        }

        if (!this.betEarlyStart) {
          getOpenLog(limit)
            .then(res => {
              this.betEarlyIndex = 0
              if (res.data.length === parseInt(this.betData.early)) {
                this.betEarlyStart = true
                for (let i in res.data) {
                  if (res.data[0].last_direction !== res.data[i].last_direction) {
                    this.betEarlyStart = false
                  }
                }

                // 開始下注
                if (this.betEarlyStart) {
                  this.betEarlyDirection = parseInt(res.data[0].last_direction) === 1
                    ? 0 : 1
                  betData.buy_direction = this.betEarlyDirection
                  betData.money = this.betData.moneyList[this.betEarlyIndex].money
                  this.betRequset(betData, res => {
                    this.betEarlyIndex++
                  })
                }
              }
            })
            .catch(err => {
              console.log(err)
              this.$alert('鏈接網絡超時', '消息提示', { type: 'warning' })
              this.init()
            })
        } else {
          // 開始下注
          this.getFiveInfo(res => {
            if (res.data.length > 0) {
              if (parseInt(res.data[0].last_money) > 0) {
                this.betEarlyStart = false
              } else {
                betData.buy_direction = this.betEarlyDirection
                betData.money = this.betData.moneyList[this.betEarlyIndex].money
                this.betRequset(betData, res => {
                  this.betEarlyIndex++
                })
              }
            } else {
              this.$alert('預警下注出錯，請重新啟動', '消息提示', { type: 'warning' })
              this.init()
            }
          })
        }
      },

      // 獲取五期記錄
      getFiveInfo (callback) {
        getFiveLog()
          .then(res => {
            if (res.code === 200) {
              callback(res)
            } else {
              this.$alert('外掛出現錯誤，已停止運行如果多次發生此類情況請聯繫客服處理', '外掛出現錯誤', { type: 'error' })
              this.init()
            }
          })
          .catch(err => {
            console.log('獲取失敗：', err)
          })
      },

      // 投注請求
      betRequset (betData, callback) {
        betOrder(betData)
          .then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getHistory()
              if (callback) callback(res)
            } else if (res.code === 2000) {
              console.log('已經購買過，無須再購買')
            } else {
              this.$alert(res.msg, '消息提示', { type: 'warning' })
              this.init()
            }
          })
          .catch(err => {
            console.log('err:', err)
            this.$alert('外掛下單錯誤，已停止運行如果多次發生此類情況請聯繫客服處理', '外掛出現錯誤', { type: 'error' })
            this.init()
          })
      },

      // 判斷外掛是否在啟動中
      isStarting () {
        if (this.$store.state.status.isStart) {
          this.$message.warning({ message: '請先停止外掛再進行操作', showClose: true })
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
