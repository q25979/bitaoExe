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
    </div>
  </div>
</template>

<script>
  import { getDealLog, betOrder, getFiveLog } from '@/fetch/common.js'

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
        timer: null,
        orderTimer: null,
        betBase: { money: 0 },
        betEarly: { money: 0 }
      }
    },
    components: {},
    created () {
      clearInterval(this.orderTimer)
      this.getHistory()
      this.orderTimer = setInterval(this.getHistory, 1000 * 60 * 2)
      this.init()
    },
    watch: {
      '$route' (val) {
        if (val.name === 'index') {
          this.init()
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

        document.body.onclick = () => {
          this.startStatus = false
        }
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
          this.$message({ type: 'warning', message: message + '未設置，請先設置再進行操作', showClose: true })
        } else {
          try {
            this.betData = JSON.parse(data)
            this.betEarly = JSON.parse(data)
            this.betBase = JSON.parse(data)
          } catch (err) {
            this.$message({ type: 'warning', message: message + '設置錯誤，請重新設置', showClose: true })
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
        this.timer = setInterval(this.timerFunc, 1000 * 60 * 5)
      },

      // 延時函數
      timerFunc () {
        if (parseInt(this.betData.bet_number) <= 0) {
          this.init()
          this.$alert('外掛已執行完畢', '提示', { type: 'success' })
        } else {
          // 下單
          if (this.startType === 2) {
            // 預警倍投

          } else if (this.startType === 3) {
            // 普通倍投
            if (parseInt(this.betData.bet_number) === parseInt(this.betBase.bet_number)) {
              this.betRequset()
            } else {
              this.getFiveInfo((res) => {
                if (res.data.length > 0) {
                  if (parseFloat(res.data[0].last_money) <= 0) {
                    this.betData.money = parseFloat(this.betData.money) * 3
                  } else {
                    this.betData.money = this.betBase.money
                  }
                  this.betRequset()
                }
              })
            }
          } else {
            // 預約下注
            this.betRequset()
          }
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
      betRequset () {
        betOrder(this.betData)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.betData.bet_number--
              this.$message.success(res.msg)
              this.getHistory()
            } else {
              this.$alert(res.msg, '外掛出現錯誤', { type: 'error' })
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
