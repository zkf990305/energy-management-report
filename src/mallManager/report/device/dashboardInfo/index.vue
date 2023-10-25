<template>
  <div class="container">
    <div class="top-container">
      <el-row>
        <!-- 水 -->
        <!-- <el-col :span="8">
          <div class="sub-block1">
            <el-row>
              <el-col :span="12">
                <div class="sub-sub-top-left">
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-top">
                        <div class="content">本月用水总量</div>
                        <div class="content-water">
                          {{ totalWaterByMonth }}m³
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-bottom">
                        <div class="content">今日用水总量</div>
                        <div class="content-water">{{ totalWaterByDay }}m³</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="sub-sub-top-right">
                  <img src="@/assets/dashboard_images/water.png" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="sub-sub-bottom-echarts">
                  <div class="content">本月用水分布</div>
                  <div class="chart">
                    <div
                      id="echarts-bar-Consumption-month-water-Ingredient"
                      style="width: 100%; height: 150px"
                    ></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col> -->
        <!-- 气 -->
        <el-col :span="12">
          <div class="sub-block1">
            <el-row>
              <el-col :span="12">
                <div class="sub-sub-top-left">
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-top">
                        <div class="content">本月用气总量</div>
                        <div class="content-gas">{{ totalGasByMonth }} m³</div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-bottom">
                        <div class="content">今日用气总量</div>
                        <div class="content-gas">{{ totalGasByDay }} m³</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="sub-sub-top-right">
                  <img src="@/assets/dashboard_images/gas.png" />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="sub-sub-bottom-echarts">
                  <div class="content">本月用气分布</div>
                  <div class="chart">
                    <div
                      id="echarts-bar-Consumption-month-gas-Ingredient"
                      style="width: 100%; height: 150px"
                    ></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 电 -->
        <el-col :span="12">
          <div class="sub-block1">
            <el-row>
              <el-col :span="12">
                <div class="sub-sub-top-left">
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-top">
                        <div class="content">本月用电总量</div>
                        <div class="content-electricity">
                          {{ totalElectricityByMonth }} kW·h
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="sub-sub-bottom">
                        <div class="content">今日用电总量</div>
                        <div class="content-electricity">
                          {{ totalElectricityByDay }} kW·h
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="sub-sub-top-right">
                  <img
                    style="
                      margin: 0 auto;
                      display: inline-block;
                      vertical-align: middle;
                    "
                    src="@/assets/dashboard_images/electricity.png"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="sub-sub-bottom-echarts">
                  <div class="content">本月用电分布</div>
                  <div class="chart">
                    <div
                      id="echarts-bar-Consumption-month-electricity-Ingredient"
                      style="width: 100%; height: 150px"
                    ></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom-container">
      <div class="content">30天能耗对比</div>
      <div
        id="echarts-bar-Consumption-Month"
        style="width: 100%; height: 300px"
      ></div>
    </div>
  </div>
</template>

<script>
import {
  // getAllDevicesMonthReportToWater,
  getAllDevicesMonthReportToElectricity,
  getAllDevicesMonthReportToGas,
  // getIngredientDevicesMonthReportToWater,
  getIngredientDevicesMonthReportToElectricity,
  getIngredientDevicesMonthReportToGas,
} from "@/api/hefei";
import * as echarts from "echarts";
import dayjs from "dayjs";
// 全局变量 echarts实例
// let pieChartWater;
let pieChartGas;
let pieChartElectricity;
let barCharMonth;

export default {
  data() {
    return {
      // 水
      // waterIngredientConsumptionMonth: [],
      // waterConsumptionMonth: [],
      // totalWaterByMonth: 0,
      // totalWaterByDay: 0,
      // 气
      gasIngredientConsumptionMonth: [],
      gasConsumptionMonth: [],
      totalGasByMonth: 0,
      totalGasByDay: 0,
      // 电
      electricityIngredientConsumptionMonth: [],
      electricityConsumptionMonth: [],
      totalElectricityByMonth: 0,
      totalElectricityByDay: 0,
    };
  },
  mounted() {
    this.setEchartsBottomContainer();
    // this.setWaterEchartsByMonth();
    this.setGasEchartsByMonth();
    this.setElectricityEchartsByMonth();
  },
  methods: {
    formatToYearMonth(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },
    async setEchartsBottomContainer() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      // 用水量
      // await getAllDevicesMonthReportToWater(querydata).then((res) => {
      //   this.waterConsumptionMonth = res.data;
      // });
      // 用气量
      await getAllDevicesMonthReportToGas(querydata).then((res) => {
        this.gasConsumptionMonth = res.data;
      });
      // 用电量
      await getAllDevicesMonthReportToElectricity(querydata).then((res) => {
        this.electricityConsumptionMonth = res.data;
      });
      //   水
      // 取出 "Day", "Dosage" 字段并形成数组
      // const dayArrayWater = this.waterConsumptionMonth.map((item) => item.Day);

      // const DosageArrrayWater = this.waterConsumptionMonth.map(
      //   (item) => item.dosageSum
      // );
      // this.totalWaterByMonth = DosageArrrayWater.reduce(
      //   (accumulator, currentValue) => accumulator + currentValue,dosageSum
      //   0
      // ).toFixed(2);
      // for (let index = 0; index < this.waterConsumptionMonth.length; index++) {
      //   if (
      //     this.waterConsumptionMonth[index].Day + "" ===
      //     this.formatToYearMonth(new Date(), "MM/DD") + ""
      //   ) {
      //     this.totalWaterByDay = this.waterConsumptionMonth[index].dosageSum;
      //   }
      // }
      // 电
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArrayElectricity = this.electricityConsumptionMonth.map(
        (item) => item.Day
      );

      const DosageArrrayElectricity = this.electricityConsumptionMonth.map(
        (item) => item.dosageSum
      );
      this.totalElectricityByMonth = DosageArrrayElectricity.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      for (
        let index = 0;
        index < this.electricityConsumptionMonth.length;
        index++
      ) {
        if (
          this.electricityConsumptionMonth[index].Day + "" ===
          this.formatToYearMonth(new Date(), "MM/DD") + ""
        ) {
          this.totalElectricityByDay =
            this.electricityConsumptionMonth[index].dosageSum;
        }
      }
      // 气
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArrayGas = this.gasConsumptionMonth.map((item) => item.Day);

      const DosageArrrayGas = this.gasConsumptionMonth.map(
        (item) => item.dosageSum
      );
      this.totalGasByMonth = DosageArrrayGas.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      for (let index = 0; index < this.gasConsumptionMonth.length; index++) {
        if (
          this.gasConsumptionMonth[index].Day + "" ===
          this.formatToYearMonth(new Date(), "MM/DD") + ""
        ) {
          this.totalGasByDay = this.gasConsumptionMonth[index].dosageSum;
        }
      }

      //   this.avgConsumptionMonthWater = (
      //     this.totalWaterByMonth / DosageArrrayWater.length
      //   ).toFixed(2);

      let option = {
        title: {
          text: "",
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
        },
        // color: ["red", "blud", "yellow"],
        legend: {
          data: ["electricity", "gas"],
          textStyle: {
            color: "#fffffff",
          },
        },

        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            // prettier-ignore
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          // {
          //   name: "water",
          //   type: "bar",
          //   data: [],
          //   markPoint: {
          //     data: [
          //       { type: "max", name: "Max" },
          //       { type: "min", name: "Min" },
          //     ],
          //   },
          //   markLine: {
          //     data: [{ type: "average", name: "Avg" }],
          //   },
          // },
          {
            name: "electricity",
            type: "bar",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "Avg" }],
            },
          },
          {
            name: "gas",
            type: "bar",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "Avg" }],
            },
          },
          //   {
          //     name: "Evaporation",
          //     type: "bar",
          //     data: [
          //       2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
          //       2.3,
          //     ],
          //     markPoint: {
          //       data: [
          //         { name: "Max", value: 182.2, xAxis: 7, yAxis: 183 },
          //         { name: "Min", value: 2.3, xAxis: 11, yAxis: 3 },
          //       ],
          //     },
          //     markLine: {
          //       data: [{ type: "average", name: "Avg" }],
          //     },
          //   },
        ],
      };
      // console.log("dayArrayWater=>", dayArrayWater);
      console.log("dayArray电=>", dayArrayElectricity);
      console.log("dayArra气=>", dayArrayGas);
      // option.xAxis[0].data = dayArrayWater;
      // option.series[0].data = DosageArrrayWater;
      option.xAxis[0].data = dayArrayElectricity;
      option.series[0].data = DosageArrrayElectricity;
      option.xAxis[0].data = dayArrayGas;
      option.series[1].data = DosageArrrayGas;

      if (
        barCharMonth != null &&
        barCharMonth != "" &&
        barCharMonth != undefined
      ) {
        barCharMonth.dispose(); //销毁
      }
      barCharMonth = echarts.init(
        document.getElementById("echarts-bar-Consumption-Month")
      );

      barCharMonth.setOption(option);

      window.onresize = barCharMonth.resize;
    },

    // async setWaterEchartsByMonth() {
    //   const querydata = {
    //     Year: this.formatToYearMonth(new Date(), "YYYY"),
    //     Month: this.formatToYearMonth(new Date(), "MM"),
    //   };
    //   // await getIngredientDevicesMonthReportToWater(querydata).then((res) => {
    //   //   this.waterIngredientConsumptionMonth = res.data;
    //   // });
    //   // 成分
    //   // const deviceIngredientArray = this.waterIngredientConsumptionMonth.map(
    //   //   (item) => item.Catalog2
    //   // );
    //   // const DosageIngredientArrray = this.waterIngredientConsumptionMonth.map(
    //   //   (item) => {
    //   //     return {
    //   //       value: item.SumDosage,
    //   //       name: item.Catalog2,
    //   //     };
    //   //   }
    //   // );
    //   let pieoption = {
    //     title: {
    //       text: "",
    //       x: "center",
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c} ({d}%)",
    //     },
    //     legend: {
    //       orient: "vertical",
    //       left: "right",
    //       data: [],
    //       textStyle: {
    //         color: "#fffffff",
    //       },
    //     },
    //     calculable: true,
    //     series: [
    //       {
    //         name: "成分来源",
    //         type: "pie",
    //         radius: "75%",
    //         center: ["30%", "60%"],
    //         data: [],
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)",
    //           },
    //         },
    //       },
    //     ],
    //   };

    //   pieoption.legend.data = deviceIngredientArray;

    //   pieoption.series[0].data = DosageIngredientArrray;

    //   if (
    //     pieChartWater != null &&
    //     pieChartWater != "" &&
    //     pieChartWater != undefined
    //   ) {
    //     pieChartWater.dispose(); //销毁
    //   }
    //   pieChartWater = echarts.init(
    //     document.getElementById(
    //       "echarts-bar-Consumption-month-water-Ingredient"
    //     )
    //   );

    //   pieChartWater.setOption(pieoption);
    //   window.onresize = pieChartWater.resize;
    // },
    async setGasEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      await getIngredientDevicesMonthReportToGas(querydata).then((res) => {
        this.gasIngredientConsumptionMonth = res.data;
      });
      // 成分
      const deviceIngredientArray = this.gasIngredientConsumptionMonth.map(
        (item) => item.Catalog2
      );
      const DosageIngredientArrray = this.gasIngredientConsumptionMonth.map(
        (item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2,
          };
        }
      );
      let pieoption = {
        title: {
          text: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: [],
          textStyle: {
            color: "#fffffff",
          },
        },
        calculable: true,
        series: [
          {
            name: "成分来源",
            type: "pie",
            radius: "75%",
            center: ["30%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      pieoption.legend.data = deviceIngredientArray;

      pieoption.series[0].data = DosageIngredientArrray;

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
      window.onresize = pieChartGas.resize;
    },
    async setElectricityEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(new Date(), "YYYY"),
        Month: this.formatToYearMonth(new Date(), "MM"),
      };
      await getIngredientDevicesMonthReportToElectricity(querydata).then(
        (res) => {
          this.electricityIngredientConsumptionMonth = res.data;
        }
      );
      // 成分
      const deviceIngredientArray =
        this.electricityIngredientConsumptionMonth.map((item) => item.Catalog2);
      const DosageIngredientArrray =
        this.electricityIngredientConsumptionMonth.map((item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2,
          };
        });
      let pieoption = {
        title: {
          text: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: [],
          textStyle: {
            color: "#fffffff",
          },
        },
        calculable: true,
        series: [
          {
            name: "成分来源",
            type: "pie",
            radius: "75%",
            center: ["30%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      pieoption.legend.data = deviceIngredientArray;

      pieoption.series[0].data = DosageIngredientArrray;

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
      window.onresize = pieChartElectricity.resize;
    },
  },
};
</script>

<style>
.container {
  background-color: #ffffff;
  /* width: 70%; */
}
.top-container {
  min-width: 100%;
  margin-bottom: 20px;
}
.bottom-container {
  background-color: #f5f5f5;
  height: 300px;
  padding: 20px;
}

.sub-block1 {
  background-color: #ffffff;
  padding: 10px;
}
.sub-sub-top-left {
  background-color: #f5f5f5;
  height: 200px;
  padding: 10px;
}
.sub-sub-top {
  background-color: #f5f5f5;
  height: 90px;
  margin-bottom: 10px;
}
.content {
  /* color: #ffffff; */
}
.content-water {
  font-size: 16px;
  color: #017bd8;
}
.content-electricity {
  font-size: 16px;
  color: red;
}
.content-gas {
  font-size: 16px;
  color: #32e2b2;
}
.sub-sub-bottom {
  background-color: #f5f5f5;
  height: 90px;
}
.sub-sub-bottom-echarts {
  background-color: #f5f5f5;
  height: 200px;
}
.chart {
  height: 150px;
  width: 100%;
}
/* 在小屏幕上，设置较小的echarts大小 */
@media screen and (max-width: 768px) {
  .sub-sub-bottom-echarts {
    height: 100px;
  }
}

/* 在中等屏幕上，设置中等大小的echarts */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .sub-sub-bottom-echarts {
    height: 180px;
  }
}

/* 在大屏幕上，设置较大的echarts大小 */
@media screen and (min-width: 1025px) {
  .sub-sub-bottom-echarts {
    height: 250px;
  }
}
.sub-sub-top-right {
  background-color: #f5f5f5;
  height: 200px;
}

/* 在小屏幕上，设置较小的echarts大小 */
@media screen and (max-width: 768px) {
  .bottom-container {
    height: 280px;
  }
}

/* 在中等屏幕上，设置中等大小的echarts */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .bottom-container {
    height: 330px;
  }
}

/* 在大屏幕上，设置较大的echarts大小 */
@media screen and (min-width: 1025px) {
  .bottom-container {
    height: 430px;
  }
}
</style>
