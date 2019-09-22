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
    }
  }
</style>

<template>
  <div id="index">
    <top></top>
    <div class="center ys-container">
      <div class="function-btn ys-mb__10">
        <el-button type="success"><i class="el-icon-video-play ys-mr__5"></i>啟動輔助</el-button>
        <router-link tag="el-button" to="/appointment">預約下注</router-link>
        <router-link tag="el-button" to="/early">預警倍投</router-link>
        <router-link tag="el-button" to="/base">普通倍投</router-link>
      </div>
      <div class="bets-record">
        <div class="title ys-p__10">
          <span class="ys-bold">下注記錄</span>
          <ul class="ys-fr ys-clearfix">
            <li>賬戶餘額：1000</li>
            <span>|</span>
            <li>獲取利潤：0.5555</li>
            <span>|</span>
            <li>當前期數：125</li>
            <span>|</span>
            <li>下注金額：200</li>
            <span>|</span>
            <li>下注方向：漲</li>
          </ul>
        </div>
        <el-table
          :data="betsList"
          border
          size="small"
          style="width: 100%"
          height="350px">
          <el-table-column
            prop="number"
            align="center"
            label="期號">
          </el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="金額">
          </el-table-column>
          <el-table-column
            prop="dir"
            align="center"
            label="方向">
          </el-table-column>
          <el-table-column
            prop="open"
            align="center"
            label="開獎">
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            label="下注時間">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="optionData.page"
            :page-sizes="[30, 60, 90, 300]"
            :page-size="30"
            :total="50"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import top from '@/components/index/top'

  export default {
    name: 'index',
    data () {
      return {
        betsList: [{
          'number': 2019050521,
          'money': 100,
          'dir': '漲',
          'open': '漲',
          'time': '2019-08-15 08:32:12'
        }],
        optionData: {
          page: 1
        }
      }
    },
    methods: {},
    components: { top },
    created () {
      console.log(this.betsList)
    }
  }
</script>