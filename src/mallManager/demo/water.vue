<template>
  <div class="dashboard-container">
    <div class="dashboard-text">water</div>
    月份 水流量月报表
    <div class="block">
      <span class="demonstration" v-if="valueWaterWeek != ''">{{
        valueWaterWeek
      }}</span>
      <el-date-picker
        v-model="valueWaterWeek"
        value-format="yyyy-MM"
        type="month"
        placeholder="选择月"
        @change="setEchartsWeekWater"
      >
      </el-date-picker>
      <div
        id="echarts-bar-chart-week-water"
        style="width: 100%; height: 500px"
      ></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "water",
  data() {
    return {
      // 月份
      valueWaterWeek: "",
    };
  },
  mounted() {},
  methods: {
    setEchartsWeekWater() {
      if (this.valueWaterWeek && this.valueWaterWeek.length > 0) {
        let barChart = echarts.init(
          document.getElementById("echarts-bar-chart-week-water")
        );
        let baroption = {
          title: {
            text: this.valueWaterWeek + "用水量月报表",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["蒸发量"],
          },
          grid: {
            x: 30,
            x2: 40,
            y2: 24,
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              data: [
                "06/17",
                "06/18",
                "06/19",
                "06/20",
                "06/21",
                "06/22",
                "06/23",
                "06/24",
                "06/25",
                "06/26",
                "06/27",
                "06/28",
              ],
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            // {
            //   name: "蒸发量",
            //   type: "bar",
            //   data: [
            //     2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
            //     3.3,
            //   ],
            //   markPoint: {
            //     data: [
            //       { type: "max", name: "最大值" },
            //       { type: "min", name: "最小值" },
            //     ],
            //   },
            //   markLine: {
            //     data: [{ type: "average", name: "平均值" }],
            //   },
            // },
            {
              name: "降水量",
              type: "bar",
              data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
                2.3,
              ],
              markPoint: {
                data: [
                  {
                    name: "年最高",
                    value: 182.2,
                    xAxis: 7,
                    yAxis: 183,
                    symbolSize: 18,
                  },
                  { name: "年最低", value: 2.3, xAxis: 11, yAxis: 3 },
                ],
              },
              markLine: {
                data: [{ type: "average", name: "平均值" }],
              },
            },
          ],
        };
        barChart.setOption(baroption);

        window.onresize = barChart.resize;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
