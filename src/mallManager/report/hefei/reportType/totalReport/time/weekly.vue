<template>
  <div class="dashboard-container">
    <div class="dashboard-text" v-if="weekText1 !== null">
      {{ weekText1 }}
      <el-tooltip
        class="item"
        effect="dark"
        content="双击跳转"
        placement="top-start"
      >
        <el-button
          icon="el-icon-share"
          type="info"
          @click="ShowDetail"
          size="mini"
          >数据详情</el-button
        >
      </el-tooltip>
      <el-divider></el-divider>
    </div>

    <div
      id="echarts-bar-Consumption-week"
      style="width: 100%; height: 500px"
    ></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="weekText2 !== null">
      {{ weekText2 }}
      <el-divider></el-divider>
    </div>

    <div id="echarts-bar-device-week" style="width: 100%; height: 500px"></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="weekText3 !== null">
      {{ weekText3 }}
      <el-divider></el-divider>
    </div>

    <div
      id="echarts-bar-ingredient-week"
      style="width: 100%; height: 500px"
    ></div>

    <div id="pageDetail" v-show="detailShow">
      详细数据
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="ID" label="ID" width="180"> </el-table-column>
        <el-table-column prop="Day" label="日期" width="180"> </el-table-column>
        <el-table-column prop="Name" label="设备名称" width="180">
        </el-table-column>
        <el-table-column prop="Dosage" label="用量"> </el-table-column>
        <el-table-column prop="Unit" label="单位"> </el-table-column>
        <el-table-column prop="Time" label="记录时间" :formatter="formatTime">
        </el-table-column>
      </el-table>

      <download-excel
        v-if="tableData.length > 0"
        class="export-excel-wrapper"
        :data="tableData"
        :fields="json_fields"
        :header="title"
        name="需要导出的表格名字.xls"
      >
        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
        <el-button type="success">导出数据</el-button>
      </download-excel>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  // getAllDevicesWeekReportToWater,
  getAllDevicesWeekReportToElectricity,
  getAllDevicesWeekReportToGas,
  // getSortDevicesWeekReportToWater,
  getSortDevicesWeekReportToElectricity,
  getSortDevicesWeekReportToGas,
  // getIngredientDevicesWeekReportToWater,
  getIngredientDevicesWeekReportToElectricity,
  getIngredientDevicesWeekReportToGas,
  // getAllDevicesWeekReportToWaterDetail,
  getAllDevicesWeekReportToElectricityDetail,
  getAllDevicesWeekReportToGasDetail,
} from "@/api/hefei";
import dayjs from "dayjs";
// 全局变量
let barChart;
let barDeviceChart;
let pieChart;
export default {
  props: {
    weekTime: Date,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      title: "表格",
      json_fields: {
        ID: "ID",
        日期: "Day",
        设备名称: "Name",
        用量: "Dosage",
        单位: "Unit",
        记录时间: "Time",
      },
      DetailsForm: [],
      // deviceInfo: {},
      tableData: [],
      detailShow: false,
      weekText1: "",
      weekText2: "",
      weekText3: "",
      //   周报表 用水/电/气量对象
      objConsumptionWeek: [],
      //   周报表 排序 用水/电/气量对象
      objSortConsumptionWeek: [],
      //   周报表 成分图 用水/电/气量对象
      objIngredientConsumptionWeek: [],
      //   总用量
      totalConsumptionWeek: 0,
      //   平均用量
      avgConsumptionWeek: 0,
      // 单位
      monthUnit: "kW·h",
    };
  },
  watch: {
    // 监听currentTime属性的改变
    weekTime(newVal, oldVal) {
      this.setEchartsByWeek();
    },
  },
  methods: {
    formatTime(row) {
      // 获取 Time 字段的原始值
      const time = row.Time;

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss"); // 假设想要使用本地化的日期时间格式
    },
    async ShowDetail() {
      // const time = this.formatToYearWeek(this.weekTime, "YYYY-MM-DD");
      const timeTmp = this.formatWeekOfDay(this.weekTime, "week");
      const time = this.formatToYearWeek(timeTmp, "YYYY-MM-DD");

      const querydata = {
        Time: time + "",
      };
      if (this.$route.meta.Name === "水") {
        await getAllDevicesWeekReportToWaterDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        await getAllDevicesWeekReportToElectricityDetail(querydata).then(
          (res) => {
            this.tableData = Array.isArray(res.data) ? res.data : [];
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        await getAllDevicesWeekReportToGasDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      }
      this.detailShow = true;
      // debugger;
      // 获取点击的按钮对应页面的id
      let PageId = document.querySelector("#pageDetail");
      // 打印出对应页面与窗口的距离
      // console.log(PageId.offsetTop);

      // 使用平滑属性，滑动到上方获取的距离
      // 下方我只设置了top，当然 你也可以加上 left 让他横向滑动
      // widow 根据浏览器滚动条，如果你是要在某个盒子里面产生滑动，记得修改
      window.scrollTo({
        top: PageId.offsetTop,
        behavior: "smooth",
      });
    },
    init() {
      // console.log("this.$route.meta=>",this.$route.meta);
      this.setEchartsByWeek();
      // this.setText();
    },
    //计算本年的周数
    getYearWeek(endDate) {
      //本年的第一天
      let beginDate = new Date(endDate.getFullYear(), 0, 1);
      //星期从0-6,0代表星期天，6代表星期六
      let endWeek = endDate.getDay();
      if (endWeek == 0) endWeek = 7;
      let beginWeek = beginDate.getDay();
      if (beginWeek == 0) beginWeek = 7;
      //计算两个日期的天数差
      let millisDiff = endDate.getTime() - beginDate.getTime();
      let dayDiff = Math.floor(
        (millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000
      );
      return Math.ceil(dayDiff / 7) + 1;
    },
    formatToYearWeek(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },
    formatWeekOfDay(time, formatStr) {
      // 创建一个 dayjs 实例
      //   const specifiedTime = dayjs(time);

      return dayjs(time).startOf(formatStr);
    },
    setText() {
      const week = this.getYearWeek(this.weekTime);
      this.weekText1 =
        this.weekTime.getFullYear() +
        "年第" +
        (week > 9 ? week : "0" + week) +
        "周" +
        "用" +
        this.$route.meta.Name +
        "量周报表";
      this.weekText2 =
        this.weekTime.getFullYear() +
        "年第" +
        (week > 9 ? week : "0" + week) +
        "周" +
        "设备用" +
        this.$route.meta.Name +
        "排序图";
      this.weekText3 =
        this.weekTime.getFullYear() +
        "年第" +
        (week > 9 ? week : "0" + week) +
        "周" +
        "用" +
        this.$route.meta.Name +
        "成分图";
    },
    async setEchartsByWeek() {
      // let time = this.formatToYearWeek(this.weekTime, "YYYY-MM-DD");
      const timeTmp = this.formatWeekOfDay(this.weekTime, "week");
      const time = this.formatToYearWeek(timeTmp, "YYYY-MM-DD");

      const querydata = {
        Time: time + "",
      };
      if (this.$route.meta.Name === "水") {
        this.monthUnit = "m³";
        await getAllDevicesWeekReportToWater(querydata).then((res) => {
          this.objConsumptionWeek = res.data;
        });
        await getSortDevicesWeekReportToWater(querydata).then((res) => {
          this.objSortConsumptionWeek = res.data;
        });
        await getIngredientDevicesWeekReportToWater(querydata).then((res) => {
          this.objIngredientConsumptionWeek = res.data;
        });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        this.monthUnit = "kW·h";
        await getAllDevicesWeekReportToElectricity(querydata).then((res) => {
          this.objConsumptionWeek = res.data;
        });

        await getSortDevicesWeekReportToElectricity(querydata).then((res) => {
          this.objSortConsumptionWeek = res.data;
        });
        await getIngredientDevicesWeekReportToElectricity(querydata).then(
          (res) => {
            this.objIngredientConsumptionWeek = res.data;
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        this.monthUnit = "m³";
        await getAllDevicesWeekReportToGas(querydata).then((res) => {
          this.objConsumptionWeek = res.data;
        });

        await getSortDevicesWeekReportToGas(querydata).then((res) => {
          this.objSortConsumptionWeek = res.data;
        });

        await getIngredientDevicesWeekReportToGas(querydata).then((res) => {
          this.objIngredientConsumptionWeek = res.data;
        });
      }
      this.setText();
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArray = this.objConsumptionWeek.map((item) => item.Day);
      const DosageArrray = this.objConsumptionWeek.map(
        (item) => item.DosageSum
      );

      //   // 排序
      const deviceSortArray = this.objSortConsumptionWeek.map(
        (item) => item.Name
      );
      const DosageSortArrray = this.objSortConsumptionWeek.map((item) =>
        item.sumDosage.toFixed(2)
      );
      // 成分
      const deviceIngredientArray = this.objIngredientConsumptionWeek.map(
        (item) =>
          item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
      );
      const DosageIngredientArrray = this.objIngredientConsumptionWeek.map(
        (item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        }
      );
      this.totalConsumptionWeek = DosageArrray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionWeek = (
        this.totalConsumptionWeek / DosageArrray.length
      ).toFixed(2);
      let baroption = {
        title: {
          text:
            "总用" +
            this.$route.meta.Name +
            "量：" +
            this.totalConsumptionWeek +
            " " +
            this.monthUnit +
            "  日均用" +
            this.$route.meta.Name +
            "量： " +
            this.avgConsumptionWeek +
            " " +
            this.monthUnit,
        },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["用" + this.$route.meta.Name + "量"],
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
            // name: "用" + this.$route.meta.Name + "量",
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
      let barDeviceoption = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
          show: "true",
          borderWidth: "0",
        },

        color: ["#1c1cf0"],
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: [],
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
            // name: report_data.label,
            type: "bar",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
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
      baroption.xAxis[0].data = dayArray;
      baroption.series[0].data = DosageArrray;
      barDeviceoption.xAxis[0].data = deviceSortArray;
      barDeviceoption.series[0].data = DosageSortArrray;
      //   console.log("DosageIngredientArrray=>", DosageIngredientArrray);
      pieoption.series[0].data = DosageIngredientArrray;

      if (barChart != null && barChart != "" && barChart != undefined) {
        barChart.dispose(); //销毁
      }
      barChart = echarts.init(
        document.getElementById("echarts-bar-Consumption-week")
      );

      barChart.setOption(baroption);

      window.onresize = barChart.resize;
      if (
        barDeviceChart != null &&
        barDeviceChart != "" &&
        barDeviceChart != undefined
      ) {
        barDeviceChart.dispose(); //销毁
      }
      barDeviceChart = echarts.init(
        document.getElementById("echarts-bar-device-week")
      );

      barDeviceChart.setOption(barDeviceoption);

      window.onresize = barDeviceChart.resize;
      if (pieChart != null && pieChart != "" && pieChart != undefined) {
        pieChart.dispose(); //销毁
      }
      pieChart = echarts.init(
        document.getElementById("echarts-bar-ingredient-week")
      );

      pieChart.setOption(pieoption);
      window.onresize = pieChart.resize;
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