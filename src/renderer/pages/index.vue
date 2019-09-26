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
        <el-button :type="$store.state.status.isStart?'danger':'success'" @click="start"><i :class="$store.state.status.isStart?'el-icon-video-pause':'el-icon-video-play'" class="ys-mr__5"></i>{{isStartText}}</el-button>
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
            <li>賬戶餘額：{{parseFloat(balance).toFixed(2)}}</li>
            <span>|</span>
            <li>獲取利潤：{{parseFloat(amt).toFixed(2)}}</li>
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
  import top from '@/components/index/top'
  import { getDealLog } from '@/fetch/common.js'

  export default {
    name: 'index',
    data () {
      return {
        isStartText: '啟動外掛',
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
        curnumber: 1
      }
    },
    components: { top },
    created () {
      this.getHistory()
    },
    methods: {
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
      start () {
        var bStart = this.$store.state.status.isStart
        if (bStart) {
          this.$store.dispatch('updateStartStatus', false)
        } else {
          this.startStatus = !this.startStatus
        }
      },

      startList (index) {
        console.log(index)
        this.startStatus = false
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
