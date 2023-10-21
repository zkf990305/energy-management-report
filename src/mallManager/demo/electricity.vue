<template>
  <div class="dashboard-container">
    <!-- 卡片视图区域 -->
    <!-- 添加商品按钮 -->
    <!-- 搜素和添加区域 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="printChartToPDF"
            >导出为PDF</el-button
          >
          <!-- <el-button type="primary" @click="goAddPage">添加商品</el-button> -->
        </el-col>
      </el-row>
    </el-card>
    <div class="dashboard-text">electricity</div>
    <div class="block">
      <el-date-picker
        v-model="valueElectricityWeek"
        value-format="yyyy-MM"
        type="month"
        placeholder="选择月"
        @change="timeHandleChange"
      >
      </el-date-picker>
    </div>
    <div id="print-container" style="align-items: center; margin-left: 10px">
      <h1>{{ valueElectricityWeek }}电流量月报表</h1>

      <div
        id="echarts-bar-chart-week-electricity1"
        style="width: 90%; height: 600px"
      ></div>
      <el-divider></el-divider>

      <h1>{{ valueElectricityWeek }} 设备用电排序图</h1>

      <div
        id="echarts-bar-chart-week-electricity2"
        style="width: 100%; height: 600px"
      ></div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default {
  name: "electricity",
  data() {
    return {
      // 获取商品列表的参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        // pagenum: 1,
        // // 每页显示条数
        // pagesize: 10,
      },
      // 月份
      valueElectricityWeek: dayjs(new Date()).format("YYYY年MM月"),
      // 总用电量
      total: "总用电量：66616.6 kwh",
      // 日均用电量
      average: "日均用电量：5551.38 kwh",
    };
  },
  mounted() {},
  methods: {
    // 打印
    printChartToPDF() {
      var fileName = "报表";
      const fileList = document.getElementsByClassName(
        "print-container-" + this.activeName
      ); // 很重要
      htmlPdf(
        fileName,
        document.querySelector("print-container-" + this.activeName),
        fileList
      );
      // // 每页最大高度
      // const maxPageHeight = 700;
      // // 当前页面高度
      // let currentPageHeight = 0;
      // const chartContainer = document.getElementById("print-container"); // 替换成你的图表容器的ID
      // // const filename = "chart.pdf"; // 导出的文件名
      // html2canvas(chartContainer).then((canvas) => {
      //   const imgData = canvas.toDataURL("image/png");
      //   const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);
      //   // 渲染图片
      //   pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      //   // 获取当前页面高度
      //   const elementHeight = 20;
      //   // 如果当前页面剩余高度不足以容纳下一个元素，则添加新页面
      //   if (currentPageHeight + elementHeight > maxPageHeight) {
      //     pdf.addPage();
      //     currentPageHeight = 0;
      //   }
      //   // 将当前元素添加到 PDF 页面中
      //   // pdf.text("Hello, World!", 20, elementHeight + currentPageHeight);
      //   // currentPageHeight += elementHeight;
      //   // 下载 PDF
      //   pdf.save("test.pdf");
      // }
      // );
    },
    // 初始化
    init() {
      // this.
    },
    timeHandleChange() {
      if (this.valueElectricityWeek && this.valueElectricityWeek.length > 0) {
        this.setEchartselectricityElectricity();
        this.setEchartselectricityElectricityByDevice();
      }
    },
    // 随月份变化 渲染echarts 用电量
    setEchartselectricityElectricity() {
      let barChart = echarts.init(
        document.getElementById("echarts-bar-chart-week-electricity1")
      );
      let baroption = {
        title: { text: this.total + "    " + this.average },
        tooltip: {
          trigger: "axis",
        },
        // labelRotate: -90,
        legend: {
          data: ["用电量"],
        },
        grid: {
          x: 50,
          x2: 55,
          y2: 40,
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [
              "06/13",
              "06/14",
              "06/16",
              "06/17",
              "06/18",
              "06/19",
              "06/20",
              "06/21",
              "06/22",
              "06/23",
              "06/24",
              "06/25",
            ],
            axisLabel: {
              rotate: -90,
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "用电量",
            type: "bar",
            data: [
              83.96, 30537.94, -9894.99, 31744.26, -1755.33, -10541.77,
              11328.49, 32644.3, -219510.12, 206431.85, -6389.27, 1937.28,
            ],
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

      barChart.setOption(baroption);

      window.onresize = barChart.resize;
    },
    // 随月份变化 渲染echarts 设备排序图
    setEchartselectricityElectricityByDevice() {
      let barChart = echarts.init(
        document.getElementById("echarts-bar-chart-week-electricity2")
      );
      let baroption = {
        title: { text: "" },
        tooltip: {
          trigger: "axis",
        },
        // labelRotate: -90,
        // legend: {
        //   data: ["用电量"],
        // },
        grid: {
          x: 50,
          x2: 50,
          y: 65,
          y2: 80,
        },
        color: ["red"],
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [
              "PM_12AP13",
              "PM_12ALZ01",
              "PM_12AP14",
              "PM_12AP06",
              "PM_12AP02",
              "PM_12AP09",
              "PM_13AP06",
              "PM_12AP08",
              "PM_12AP04",
              "PM_13AP07",
              "PM_12AP12",
              "PM_13AP04",
              "PM_12AP10",
              "PM_12AP05",
              "PM_13AP03",
              "PM_13AP02",
              "PM_12AP30",
              "PM_13AP01",
              "PM_12AP01",
              "PM_12AP03",
              "PM_12AP07",
              "PM_12AP11",
              "PM_12AP15",
              "PM_12AP16",
              "PM_12AP17",
              "PM_12AP18",
              "PM_12AP19",
              "PM_12AP20",
              "PM_12AP29",
              "PM_13AC01",
              "PM_13AC02",
              "PM_13AP05",
              "PM_13AP08",
              "PM_13AP09",
              "PM_13AP10",
              "PM_13AP11",
              "PM_13AP12",
              "PM_12AP21",
            ],
            axisLabel: {
              rotate: -90,
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "用电量",
            type: "bar",
            data: [
              13876.31, 10642.83, 9967.9, 9297.2, 7248.71, 6034.4, 4112.08,
              3208.16, 1247.37, 1149.68, 1137.14, 701.92, 689.34, 652.31,
              593.42, 365.52, 270.61, 9.36, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              -4587.66,
            ],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // markLine: {
            //   data: [{ type: "average", name: "平均值" }],
            // },
          },
        ],
      };

      barChart.setOption(baroption);

      window.onresize = barChart.resize;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // display: flex;
    // justify-content: space-between;
    // padding-left: 0;
    // align-items: center;
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
