<template>
  <div id="app-container">
    <button @click="printChartToPDF">导出为PDF</button>
    <!-- 每日报表 -->
    <div class="dashboard-container">
      <div slot="header">温度每日报表</div>
      <!-- <span class="dashboard-text">选择日期：</span> -->
      <el-date-picker
        v-model="valueDay"
        type="date"
        placeholder="选择日期时间"
        align="right"
        :picker-options="pickerOptions"
        @change="handleChangeDay"
      >
      </el-date-picker>
    </div>
    <!-- 每周报表 -->
    <div class="dashboard-container">
      <div slot="header">温度每周报表</div>
      <el-date-picker
        v-model="valueWeek"
        type="week"
        placeholder="选择周"
        format="yyyy 第 MM 周"
        align="right"
        @change="handleChangeWeek"
      >
      </el-date-picker>
    </div>
    <!-- 每月报表 -->
    <div class="dashboard-container">
      <div slot="header">温度每月报表</div>
      <div class="block">
        <el-date-picker
          v-model="valueMonth"
          type="month"
          placeholder="选择月"
          format="yyyy-MM"
          @change="handleChangeMonth"
        >
        </el-date-picker>
      </div>
    </div>
    <div id="print-container">
      <div class="day-card" v-show="tableValueData.length">
        <div id="temperatureDay_list" style="width: 100%; height: 500px"></div>
        <div>
          <div slot="header">详细数据</div>
          <el-table :data="tableValueData" style="width: 100%">
            <el-table-column prop="ID" label="ID" width="180">
            </el-table-column>
            <el-table-column prop="ValueID" label="ValueID" width="180">
            </el-table-column>
            <el-table-column prop="ValueName" label="设备名称">
            </el-table-column>
            <el-table-column prop="Value" label="温度"> </el-table-column>
            <el-table-column prop="CreateTime" label="创建日期">
            </el-table-column>
            <el-table-column prop="DeviceID" label="DeviceID">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="week-card" v-show="tablValueWeek.length">
        <div
          id="temperatureWeek_list"
          style="width: 1800px; height: 600px"
        ></div>
        <div>
          <div slot="header">详细数据</div>
          <el-table :data="tablValueWeek" style="width: 100%">
            <el-table-column prop="Date" label="记录" width="180">
              <!-- <template slot-scope="scope"></template> -->
            </el-table-column>
            <el-table-column
              prop="FirstTemperature"
              label="本周开始数据"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="LastTemperature" label="本周结束数据">
            </el-table-column>
            <el-table-column prop="MinTemperature" label="本周最小温度">
            </el-table-column>
            <el-table-column prop="MaxTemperature" label="本周最大温度">
            </el-table-column>
            <!-- <el-table-column prop="DeviceID" label="DeviceID"> </el-table-column> -->
          </el-table>
        </div>
        s
      </div>
      <div class="month-card" v-show="tablValueMonth.length">
        <div
          id="temperatureMonth_list"
          style="width: 1800px; height: 600px"
        ></div>
        <div>
          <div slot="header">详细数据</div>
          <el-table :data="tablValueMonth" style="width: 100%">
            <el-table-column prop="Date" label="记录" width="180">
              <!-- <template slot-scope="scope"></template> -->
            </el-table-column>
            <el-table-column
              prop="FirstTemperature"
              label="本月开始数据"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="LastTemperature" label="本月结束数据">
            </el-table-column>
            <el-table-column prop="MinTemperature" label="本月最小温度">
            </el-table-column>
            <el-table-column prop="MaxTemperature" label="本月最大温度">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import weekOption from "./week_report";
import {
  // getModelHistoryData,
  queryValueDay,
  queryValueWeek,
  queryValueMonth,
} from "@/mallManager/report/environmentInfo/api.js";
export default {
  name: "EnvironmentInfo",

  data() {
    return {
      dayObj: {
        year: 0,
        month: 0,
        day: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      valueDay: "",
      valueWeek: "",
      valueMonth: "",
      // 存储格式化后的数据
      // formattedDate: "",

      routeData: {
        Id: 0,
        Name: "",
      },
      tablValueWeek: [],
      tableData: [],
      tableValueData: [],
      tablValueMonth: [],
    };
  },
  mounted() {
    this.init();
    // this.queryValueDay();
    this.getqueryValueDayChar();
    // this.setDayTemperature();
    this.setWeekTemperature();
    this.getModelHistoryDataByWeek();
    this.getModelHistoryDataByMonth();
  },
  methods: {
    // 打印
    printChartToPDF() {
      // 每页最大高度
      const maxPageHeight = 700;

      // 当前页面高度
      let currentPageHeight = 0;
      const chartContainer = document.getElementById("print-container"); // 替换成你的图表容器的ID
      // const filename = "chart.pdf"; // 导出的文件名

      html2canvas(chartContainer).then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 0.8);
        const pdf = new jsPDF("p", "mm", [canvas.width, canvas.height]);

        // 渲染图片
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

        // 获取当前页面高度
        const elementHeight = 20;

        // 如果当前页面剩余高度不足以容纳下一个元素，则添加新页面
        if (currentPageHeight + elementHeight > maxPageHeight) {
          pdf.addPage();
          currentPageHeight = 0;
        }

        // 将当前元素添加到 PDF 页面中
        // pdf.text("Hello, World!", 20, elementHeight + currentPageHeight);
        // currentPageHeight += elementHeight;

        // 下载 PDF
        pdf.save("test.pdf", { compress: true });
      });
    },
    // 初始化
    init() {
      this.routeData = this.$route.meta;
      let date = new Date();
      this.valueDay = date;
      // 获取年份
      this.dayObj.year = dayjs(date).year();
      // 获取月份（返回值从0开始，所以需要加上1）
      this.dayObj.month = dayjs(date).month() + 1;

      // 获取日期
      this.dayObj.day = dayjs(date).date();

      // 获取当前日期所在周的起始时间
      this.valueWeek = dayjs(date).startOf("week");
      this.valueMonth = this.dayObj.year + "-" + this.dayObj.month;
      // console.log("this.valueWeek=>", this.valueWeek);
    },
    handleChangeDay(date) {
      // this.date = date; // 更新日期变量
      // this.formattedDate = dayjs(date).format("YYYY-MM-DD"); // 使用 dayjs 格式化日期
      // 获取年份
      this.dayObj.year = dayjs(date).year();

      // 获取月份（返回值从0开始，所以需要加上1）
      this.dayObj.month = dayjs(date).month() + 1;
      // 获取日期
      this.dayObj.day = dayjs(date).date();
      this.getqueryValueDayChar();
      // this.getModelHistoryDataByWeek();
    },
    handleChangeWeek(date) {
      // this.date = date; // 更新日期变量
      // this.formattedDate = dayjs(date).format("YYYY-MM-DD"); // 使用 dayjs 格式化日期
      // 获取年份
      // this.dayObj.year = dayjs(date).year();

      // // 获取月份（返回值从0开始，所以需要加上1）
      // this.dayObj.month = dayjs(date).month() + 1;
      // // 获取日期
      // this.dayObj.day = dayjs(date).date();
      // this.getqueryValueDayChar();
      // 获取当前日期所在周的起始时间
      this.valueWeek = dayjs(date).startOf("week");
      this.getModelHistoryDataByWeek();
    },
    handleChangeMonth() {
      this.getModelHistoryDataByMonth();
    },
    async getqueryValueDayChar() {
      const data = this.dayObj;

      data.valueName = this.routeData.title + ".温度";
      data.deviceId = this.routeData.Id;
      // console.log(this.routeData);
      await queryValueDay(data).then((res) => {
        this.tableValueData = res.data;
      });
      if (this.tableValueData && this.tableValueData.length > 0) {
        this.setDayTemperature();
      }
    },
    async getModelHistoryDataByWeek() {
      const data = {};
      // console.log("this.valueWeek=>", this.valueWeek);
      data.timeDate = dayjs(this.valueWeek).format("YYYY-MM-DD");
      data.valueName = this.routeData.title + ".温度";
      data.deviceId = this.routeData.Id;
      await queryValueWeek(data).then((res) => {
        this.tablValueWeek = res.data[2];
      });
      // console.log("this.tableValueWeek=>", this.tablValueWeek);
      if (this.tablValueWeek && this.tablValueWeek.length > 0) {
        this.setWeekTemperature();
      }
    },
    async getModelHistoryDataByMonth() {
      const data = {};
      console.log("this.valueMonth11=>", this.valueMonth);
      data.timeDate = dayjs(this.valueMonth).format("YYYY-MM");
      data.valueName = this.routeData.title + ".温度";
      data.deviceId = this.routeData.Id;
      await queryValueMonth(data).then((res) => {
        this.tablValueMonth = res.data;
      });
      console.log("this.tablValueMonth=>", this.tablValueMonth);
      if (this.tablValueMonth && this.tablValueMonth.length > 0) {
        this.setMonthTemperature();
      }
    },

    setDayTemperature() {
      let ydata = this.tableValueData.map((obj) => obj.Value);
      let xdata = this.tableValueData.map((obj) => {
        return dayjs(obj.CreateTime).format("MM/DD HH:mm");
        // return obj.CreateTime;
      });

      let chartDom = document.getElementById("temperatureDay_list");
      let myChart = echarts.init(chartDom);

      let option = {
        title: {
          text: dayjs(this.valueDay).format("YYYY 年 MM 月 DD 号") + "温度数据",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          // type: "category",
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} °C",
          },
        },
        series: [
          {
            data: [],
            type: "line",
            markPoint: {
              data: [
                { type: "max", name: "最高温度" },
                { type: "min", name: "最低温度" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均温度" }],
            },
            smooth: true,
          },
        ],
      };
      // xdata.push("09/08");
      option.xAxis.data = xdata;
      // ydata.push(-2000);
      option.series[0].data = ydata;

      option && myChart.setOption(option);
    },
    setWeekTemperature() {
      let chartDom = document.getElementById("temperatureWeek_list");
      let myChart = echarts.init(chartDom);
      let option;

      const upColor = "#ec0000";
      const upBorderColor = "#8A0000";
      const downColor = "#00da3c";
      const downBorderColor = "#008F28";
      // Each item: open，close，lowest，highest
      let res = [];
      // 数据赋值
      this.tablValueWeek.map((item) => {
        let itemTemp = [];
        itemTemp.push(dayjs(item.Date).format("YYYY/MM/DD") + "");
        itemTemp.push(item.FirstTemperature);
        itemTemp.push(item.LastTemperature);
        itemTemp.push(item.LastTemperature);
        itemTemp.push(item.MaxTemperature);
        res.push(itemTemp);
        // console.log("itemTemp=>", itemTemp);
      });
      // console.log("res=>", res[0]);
      const data0 = splitData(res);

      function splitData(rawData) {
        const categoryData = [];
        const values = [];
        for (let i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i]);
        }
        return {
          categoryData: categoryData,
          values: values,
        };
      }
      //
      function calculateMA(dayCount) {
        let result = [];
        for (let i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push("-");
            continue;
          }
          let sum = 0;
          for (let j = 0; j < dayCount; j++) {
            sum += +data0.values[i - j][1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
      option = {
        title: {
          text: dayjs(this.valueWeek).format("YYYY 年第 MM 周") + "温度周报表",
          left: 0,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["日K", "MA5", "MA10", "MA20", "MA30"],
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          data: data0.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            show: true,
            type: "slider",
            top: "90%",
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            name: "日K",
            type: "candlestick",
            data: data0.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor,
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + "" : "";
                },
              },
              data: [
                {
                  name: "Mark",
                  coord: ["2013/5/31", 2300],
                  value: 2300,
                  itemStyle: {
                    color: "rgb(41,60,85)",
                  },
                },
                {
                  name: "highest value",
                  type: "max",
                  valueDim: "highest",
                },
                {
                  name: "lowest value",
                  type: "min",
                  valueDim: "lowest",
                },
                {
                  name: "average value on close",
                  type: "average",
                  valueDim: "close",
                },
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + "<br>" + (param.data.coord || "");
                },
              },
            },
            markLine: {
              symbol: ["none", "none"],
              data: [
                [
                  {
                    name: "from lowest to highest",
                    type: "min",
                    valueDim: "lowest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                  {
                    type: "max",
                    valueDim: "highest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                ],
                {
                  name: "min line on close",
                  type: "min",
                  valueDim: "close",
                },
                {
                  name: "max line on close",
                  type: "max",
                  valueDim: "close",
                },
              ],
            },
          },
          {
            name: "MA5",
            type: "line",
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA10",
            type: "line",
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA30",
            type: "line",
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    setMonthTemperature() {
      let chartDom = document.getElementById("temperatureMonth_list");
      let myChart = echarts.init(chartDom);
      let option;

      const upColor = "#ec0000";
      const upBorderColor = "#8A0000";
      const downColor = "#00da3c";
      const downBorderColor = "#008F28";
      // Each item: open，close，lowest，highest
      let res = [];
      // 数据赋值
      this.tablValueMonth.map((item) => {
        let itemTemp = [];
        itemTemp.push(dayjs(item.Date).format("YYYY/MM/DD") + "");
        itemTemp.push(item.FirstTemperature);
        itemTemp.push(item.LastTemperature);
        itemTemp.push(item.LastTemperature);
        itemTemp.push(item.MaxTemperature);
        res.push(itemTemp);
        // console.log("itemTemp=>", itemTemp);
      });
      // console.log("res=>", res[0]);
      const data0 = splitData(res);

      function splitData(rawData) {
        const categoryData = [];
        const values = [];
        for (let i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i]);
        }
        return {
          categoryData: categoryData,
          values: values,
        };
      }
      //
      function calculateMA(dayCount) {
        let result = [];
        for (let i = 0, len = data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push("-");
            continue;
          }
          let sum = 0;
          for (let j = 0; j < dayCount; j++) {
            sum += +data0.values[i - j][1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
      option = {
        title: {
          text: dayjs(this.valueMonth).format("YYYY-MM") + "温度月报表",
          left: 0,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["日K", "MA5", "MA10", "MA20", "MA30"],
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          data: data0.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            show: true,
            type: "slider",
            top: "90%",
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            name: "日K",
            type: "candlestick",
            data: data0.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor,
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + "" : "";
                },
              },
              data: [
                {
                  name: "Mark",
                  coord: ["2013/5/31", 2300],
                  value: 2300,
                  itemStyle: {
                    color: "rgb(41,60,85)",
                  },
                },
                {
                  name: "highest value",
                  type: "max",
                  valueDim: "highest",
                },
                {
                  name: "lowest value",
                  type: "min",
                  valueDim: "lowest",
                },
                {
                  name: "average value on close",
                  type: "average",
                  valueDim: "close",
                },
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + "<br>" + (param.data.coord || "");
                },
              },
            },
            markLine: {
              symbol: ["none", "none"],
              data: [
                [
                  {
                    name: "from lowest to highest",
                    type: "min",
                    valueDim: "lowest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                  {
                    type: "max",
                    valueDim: "highest",
                    symbol: "circle",
                    symbolSize: 10,
                    label: {
                      show: false,
                    },
                    emphasis: {
                      label: {
                        show: false,
                      },
                    },
                  },
                ],
                {
                  name: "min line on close",
                  type: "min",
                  valueDim: "close",
                },
                {
                  name: "max line on close",
                  type: "max",
                  valueDim: "close",
                },
              ],
            },
          },
          {
            name: "MA5",
            type: "line",
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA10",
            type: "line",
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA20",
            type: "line",
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
          {
            name: "MA30",
            type: "line",
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
              opacity: 0.5,
            },
          },
        ],
      };
      option && myChart.setOption(option);
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
