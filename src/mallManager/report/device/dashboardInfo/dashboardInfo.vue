<template>
  <div class="dashboard-container">
    <!-- 定义一个容器 -->
    <el-container>
      <!-- 定义一个顶栏 -->
      <!-- <el-header height="60px"> -->
      <!-- 用普通的标签设置标题 -->
      <!-- <h2>elementUI布局的顶栏</h2> -->
      <!-- </el-header> -->
      <!-- 嵌套的容器 -->
      <el-container>
        <!-- 定义一个侧边的导航栏 -->
        <!-- <el-aside width="150px">侧边栏</el-aside> -->
        <!-- 定义内容栏 -->
        <el-main>
          <!-- 定义第一行，栅格布局 -->
          <el-row>
            <!-- 一行中有两个大小相同的列 -->
            <el-col :span="16" class="col1">
              <!-- 月份 总的 用电量 -->
              <div class="electricity-div">
                <div class="dashboard-text" v-if="electricityText !== null">
                  {{ electricityText }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-electricity"
                  style="width: 100%; height: 22vh"
                ></div>
              </div>
            </el-col>
            <el-col :span="8" class="col2"
              ><!-- 月份 总的 用电量 成分 -->
              <div class="water-div">
                <div class="dashboard-text" v-if="electricityText1 !== null">
                  {{ electricityText1 }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-electricity-Ingredient"
                  style="width: 100%; height: 22vh"
                ></div></div
            ></el-col>
          </el-row>
          <el-row>
            <!-- 一行中有两个大小相同的列 -->
            <el-col :span="16" class="col3"
              ><!-- 月份 总的 用气量 -->
              <div class="gas-div">
                <div class="dashboard-text" v-if="gasText !== null">
                  {{ gasText }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-gas"
                  style="width: 100%; height: 22vh"
                ></div></div
            ></el-col>
            <el-col :span="8" class="col4">
              <!-- 月份 总的 用气量 成分 -->
              <div class="water-div">
                <div class="dashboard-text" v-if="gasText1 !== null">
                  {{ gasText1 }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-gas-Ingredient"
                  style="width: 100%; height: 22vh"
                ></div></div
            ></el-col>
          </el-row>
          <el-row>
            <!-- 一行中有两个大小相同的列 -->
            <el-col :span="16" class="col5">
              <!-- 月份 总的 用水量 -->
              <div class="water-div">
                <div class="dashboard-text" v-if="waterText !== null">
                  {{ waterText }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-water"
                  style="width: 100%; height: 22vh"
                ></div></div
            ></el-col>
            <el-col :span="8" class="col6"
              ><!-- 月份 总的 用水量 成分 -->
              <div class="water-div">
                <div class="dashboard-text" v-if="waterText1 !== null">
                  {{ waterText1 }}

                  <!-- <el-divider></el-divider> -->
                </div>

                <div
                  id="echarts-bar-Consumption-month-water-Ingredient"
                  style="width: 100%; height: 22vh"
                ></div></div
            ></el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  getAllDevicesMonthReportToWater,
  getAllDevicesMonthReportToElectricity,
  getAllDevicesMonthReportToGas,
  getIngredientDevicesMonthReportToWater,
  getIngredientDevicesMonthReportToElectricity,
  getIngredientDevicesMonthReportToGas,
} from "@/api/common";
import * as echarts from "echarts";
import dayjs from "dayjs";
// 全局变量
let barChartWater;
let pieChartWater;
let barChartGas;
let pieChartGas;
let barChartElectricity;
let pieChartElectricity;

// let pieChart;
export default {
  data() {
    return {
      electricityText: "",
      electricityText1: "",
      electricityConsumptionMonth: [],
      electricityIngredientConsumptionMonth: [],
      gasText: "",
      gasText1: "",
      gasConsumptionMonth: [],
      gasIngredientConsumptionMonth: [],
      waterText: "",
      waterText1: "",
      waterConsumptionMonth: [],
      waterIngredientConsumptionMonth: [],
    };
  },
  mounted() {
    this.setWaterEchartsByMonth();
    this.setGasEchartsByMonth();
    this.setElectricityEchartsByMonth();
  },
  methods: {
    formatToYearMonth(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },

    setText() {
      this.waterText =
        this.formatToYearMonth(new Date(), "YYYY年MM月") + "用水量月报表";
      this.electricityText =
        this.formatToYearMonth(this.monthTime, "YYYY年MM月") + "用电量月报表";
      this.gasText =
        this.formatToYearMonth(this.monthTime, "YYYY年MM月") + "用气量月报表";

      this.waterText1 =
        this.formatToYearMonth(new Date(), "YYYY年MM月") + "用水成分图";
      this.gasText1 =
        this.formatToYearMonth(new Date(), "YYYY年MM月") + "用气成分图";
      this.electricityText1 =
        this.formatToYearMonth(new Date(), "YYYY年MM月") + "用电成分图";
    },
    async setElectricityEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      // 用水量
      await getAllDevicesMonthReportToElectricity(querydata).then((res) => {
        this.electricityConsumptionMonth = res.data;
      });

      // 水成分
      await getIngredientDevicesMonthReportToElectricity(querydata).then(
        (res) => {
          this.electricityIngredientConsumptionMonth = res.data;
        }
      );

      this.setText();

      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArrayElectricity = this.electricityConsumptionMonth.map(
        (item) => item.Day
      );
      const DosageArrrayElectricity = this.electricityConsumptionMonth.map(
        (item) => item.dosageSum
      );

      // 成分
      const deviceIngredientArray =
        this.electricityIngredientConsumptionMonth.map(
          (item) =>
            item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
        );
      const DosageIngredientArrray =
        this.electricityIngredientConsumptionMonth.map((item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        });
      this.totalConsumptionMonthElectricity = DosageArrrayElectricity.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionMonthElectricity = (
        this.totalConsumptionMonthElectricity / DosageArrrayElectricity.length
      ).toFixed(2);
      let baroptionElectricity = {
        title: {
          text:
            "总用电量：" +
            this.totalConsumptionMonthElectricity +
            " kW·h  日均用电量： " +
            this.avgConsumptionMonthElectricity +
            " kW·h",
        },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["用电量"],
        // },
        // grid: {
        //   x: 30,
        //   x2: 40,
        //   y2: 24,
        // },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
          show: "true",
          borderWidth: "0",
        },

        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            // name: "用电量",
            type: "bar",
            data: [],

            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      };

      let pieoption = {
        title: {
          text: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        //legend: {
        //    orient : 'vertical',
        //    x : 'left',
        //   data: report_data.content.ingredients_report.xvalues,

        //},
        calculable: true,
        series: [
          {
            name: "成分来源",
            type: "pie",
            radius: "75%",
            //center: ['50%', '60%'],
            data: [],
          },
        ],
      };
      baroptionElectricity.xAxis[0].data = dayArrayElectricity;
      baroptionElectricity.series[0].data = DosageArrrayElectricity;

      pieoption.series[0].data = DosageIngredientArrray;

      if (
        barChartElectricity != null &&
        barChartElectricity != "" &&
        barChartElectricity != undefined
      ) {
        barChartElectricity.dispose(); //销毁
      }
      barChartElectricity = echarts.init(
        document.getElementById("echarts-bar-Consumption-month-electricity")
      );

      barChartElectricity.setOption(baroptionElectricity);

      window.onresize = barChartElectricity.resize;

      if (
        pieChartElectricity != null &&
        pieChartElectricity != "" &&
        pieChartElectricity != undefined
      ) {
        pieChartElectricity.dispose(); //销毁
      }
      pieChartElectricity = echarts.init(
        document.getElementById(
          "echarts-bar-Consumption-month-electricity-Ingredient"
        )
      );

      pieChartElectricity.setOption(pieoption);
      window.onresize = pieChartWater.resize;
    },
    async setGasEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      // 用水量
      await getAllDevicesMonthReportToGas(querydata).then((res) => {
        this.gasConsumptionMonth = res.data;
      });

      // 水成分
      await getIngredientDevicesMonthReportToGas(querydata).then((res) => {
        this.gasIngredientConsumptionMonth = res.data;
      });

      this.setText();

      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArrayGas = this.gasConsumptionMonth.map((item) => item.Day);
      const DosageArrrayGas = this.gasConsumptionMonth.map(
        (item) => item.dosageSum
      );

      // 成分
      const deviceIngredientArray = this.gasIngredientConsumptionMonth.map(
        (item) =>
          item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
      );
      const DosageIngredientArrray = this.gasIngredientConsumptionMonth.map(
        (item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        }
      );
      this.totalConsumptionMonthGas = DosageArrrayGas.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionMonthGas = (
        this.totalConsumptionMonthGas / DosageArrrayGas.length
      ).toFixed(2);
      let baroptionGas = {
        title: {
          text:
            "总用气量：" +
            this.totalConsumptionMonthGas +
            "  m³  日均用气量： " +
            this.avgConsumptionMonthGas +
            "  m³",
        },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["用气量"],
        // },
        // grid: {
        //   x: 30,
        //   x2: 40,
        //   y2: 24,
        // },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
          show: "true",
          borderWidth: "0",
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            // name: "用气量",
            type: "bar",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      };

      let pieoption = {
        title: {
          text: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        //legend: {
        //    orient : 'vertical',
        //    x : 'left',
        //   data: report_data.content.ingredients_report.xvalues,

        //},
        calculable: true,
        series: [
          {
            name: "成分来源",
            type: "pie",
            radius: "75%",
            //center: ['50%', '60%'],
            data: [],
          },
        ],
      };
      baroptionGas.xAxis[0].data = dayArrayGas;
      baroptionGas.series[0].data = DosageArrrayGas;

      pieoption.series[0].data = DosageIngredientArrray;

      if (
        barChartGas != null &&
        barChartGas != "" &&
        barChartGas != undefined
      ) {
        barChartGas.dispose(); //销毁
      }
      barChartGas = echarts.init(
        document.getElementById("echarts-bar-Consumption-month-gas")
      );

      barChartGas.setOption(baroptionGas);

      window.onresize = barChartGas.resize;

      if (
        pieChartGas != null &&
        pieChartGas != "" &&
        pieChartGas != undefined
      ) {
        pieChartGas.dispose(); //销毁
      }
      pieChartGas = echarts.init(
        document.getElementById("echarts-bar-Consumption-month-gas-Ingredient")
      );

      pieChartGas.setOption(pieoption);
      window.onresize = pieChartWater.resize;
    },
    async setWaterEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      // 用水量
      await getAllDevicesMonthReportToWater(querydata).then((res) => {
        this.waterConsumptionMonth = res.data;
      });

      // 水成分
      await getIngredientDevicesMonthReportToWater(querydata).then((res) => {
        this.waterIngredientConsumptionMonth = res.data;
      });
      // 用电量
      // await getAllDevicesMonthReportToElectricity(querydata).then((res) => {
      //   this.electricityConsumptionMonth = res.data;
      // });
      // 电成分
      // await getIngredientDevicesMonthReportToElectricity(querydata).then(
      //   (res) => {
      //     this.objIngredientConsumptionMonth = res.data;
      //   }
      // );
      // 用气量
      // await getAllDevicesMonthReportToGas(querydata).then((res) => {
      //   this.gasConsumptionMonth = res.data;
      // });
      // 气成分
      // await getIngredientDevicesMonthReportToGas(querydata).then((res) => {
      //   this.objIngredientConsumptionMonth = res.data;
      // });

      this.setText();

      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArrayWater = this.waterConsumptionMonth.map((item) => item.Day);
      const DosageArrrayWater = this.waterConsumptionMonth.map(
        (item) => item.dosageSum
      );

      // 成分
      const deviceIngredientArray = this.waterIngredientConsumptionMonth.map(
        (item) =>
          item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
      );
      const DosageIngredientArrray = this.waterIngredientConsumptionMonth.map(
        (item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        }
      );
      this.totalConsumptionMonthWater = DosageArrrayWater.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionMonthWater = (
        this.totalConsumptionMonthWater / DosageArrrayWater.length
      ).toFixed(2);
      let baroptionWater = {
        title: {
          text:
            "总用水量：" +
            this.totalConsumptionMonthWater +
            " m³  日均用水量： " +
            this.avgConsumptionMonthWater +
            " m³",
        },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["用水量"],
        // },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
          show: "true",
          borderWidth: "0",
        },
        // grid: {
        //   x: 30,
        //   x2: 40,
        //   y2: 24,
        // },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            // name: "用水量",
            type: "bar",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      };

      let pieoption = {
        title: {
          text: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        //legend: {
        //    orient : 'vertical',
        //    x : 'left',
        //   data: report_data.content.ingredients_report.xvalues,

        //},
        calculable: true,
        series: [
          {
            name: "成分来源",
            type: "pie",
            radius: "75%",
            //center: ['50%', '60%'],
            data: [],
          },
        ],
      };
      baroptionWater.xAxis[0].data = dayArrayWater;
      baroptionWater.series[0].data = DosageArrrayWater;

      pieoption.series[0].data = DosageIngredientArrray;

      if (
        barChartWater != null &&
        barChartWater != "" &&
        barChartWater != undefined
      ) {
        barChartWater.dispose(); //销毁
      }
      barChartWater = echarts.init(
        document.getElementById("echarts-bar-Consumption-month-water")
      );

      barChartWater.setOption(baroptionWater);

      window.onresize = barChartWater.resize;

      if (
        pieChartWater != null &&
        pieChartWater != "" &&
        pieChartWater != undefined
      ) {
        pieChartWater.dispose(); //销毁
      }
      pieChartWater = echarts.init(
        document.getElementById(
          "echarts-bar-Consumption-month-water-Ingredient"
        )
      );

      pieChartWater.setOption(pieoption);
      window.onresize = pieChartWater.resize;
    },
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 30px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>