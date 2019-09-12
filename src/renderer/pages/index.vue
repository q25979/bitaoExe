<style lang="scss" scoped>
  #index {
    .center {
      padding: 10px;
      .bets-record {
      }
    }
  }
</style>

<template>
  <div id="index">
    <top></top>
    <div class="center ys-container">
      <div class="function-btn ys-mb__10">
        <el-button type="success">啟動輔助</el-button>
        <el-button>預約下注</el-button>
        <el-button>預警倍投</el-button>
        <el-button>普通倍投</el-button>
      </div>
      <div class="bets-record">
        <el-table :data="betsList" size="small" style="width: 100%" max-height="200px">
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
        }]
      }
    },
    methods: {},
    components: { top },
    created () {
      console.log(this.betsList)
    }
  }
</script>