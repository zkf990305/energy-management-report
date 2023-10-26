<template>
  <div class="dashboard-container">
    <div class="dashboard-text" v-if="dayText1 !== null">
      {{ dayText1 }}
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

    <div id="echarts-bar-chart-daily" style="width: 100%; height: 500px"></div>

    <div id="pageDetail" v-show="detailShow">
      详细数据
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" />
        <!-- <el-table-column prop="ID" label="ID" width="180"> </el-table-column> -->
        <el-table-column prop="Hour" label="日期"  align="center">
        </el-table-column>
        <el-table-column prop="Name" label="设备名称"  align="center">
        </el-table-column>
        <el-table-column prop="Dosage" width="180" label="用量" align="center"> </el-table-column>
        <el-table-column prop="Unit" width="180" label="单位" align="center"> </el-table-column>
        <el-table-column prop="Time" label="记录时间" :formatter="formatTime" align="center">
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
  getDevicesByID,
  // getDevicesDayReportToWater,
  getDevicesDayReportToElectricity,
  getDevicesDayReportToGas,
  // getDevicesDayReportToWaterDetail,
  getDevicesDayReportToElectricityDetail,
  getDevicesDayReportToGasDetail,
} from "@/api/hefei";
import dayjs from "dayjs";
// 全局变量
let barChart;
export default {
  props: {
    dayTime: Date,
    // queryInfo: Object,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      title: "表格",
      json_fields: {
        // ID: "ID",
        日期: "Hour",
        设备名称: "Name",
        用量: "Dosage",
        单位: "Unit",
        记录时间: "Time",
      },
      tableData: [],
      detailShow: false,
      deviceInfo: {},
      dayText1: "",
      //   月报表 用水/电/气量对象
      objConsumptionDay: [],
      //   总用量
      totalConsumptioDay: 0,
      //   平均用量
      avgConsumptioDay: 0,
      // 单位
      monthUnit: "kW·h",
    };
  },
  watch: {
    // 监听currentTime属性的改变
    dayTime(newVal, oldVal) {
      this.setEchartsByDay();
    },
  },
  methods: {
    formatTime(row) {
      // 获取 Time 字段的原始值
      const time = row.Time;

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss"); // 假设想要使用本地化的日期时间格式
    },
    async ShowDetail() {
      const querydata = {
        Time: this.formatToYearDay(this.dayTime, "YYYY-MM-DD"),
        DeviceID: this.deviceInfo.Id,
      };
      if (this.deviceInfo.Category1 === "水") {
        // await getDevicesDayReportToWaterDetail(querydata).then((res) => {
        //   this.tableData = Array.isArray(res.data) ? res.data : [];
        // });
      } else if (
        this.deviceInfo.Category1 === "电" ||
        this.deviceInfo.Category1 === "Electricity"
      ) {
        await getDevicesDayReportToElectricityDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (
        this.deviceInfo.Category1 === "气" ||
        this.deviceInfo.Category1 === "Gas"
      ) {
        await getDevicesDayReportToGasDetail(querydata).then((res) => {
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
      this.setEchartsByDay();
      // this.setText();
    },
    formatToYearDay(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },
    setText() {
      this.dayText1 =
        this.formatToYearDay(this.dayTime, "YYYY年MM月DD日") +
        this.deviceInfo.Building +
        " " +
        this.deviceInfo.Name +
        "用" +
        this.deviceInfo.Category1 +
        "量日报表";
    },

    async setEchartsByDay() {
      const data = { ID: this.$route.meta.ID };
      await getDevicesByID(data).then((res) => {
        this.deviceInfo = res.data;
        if (this.deviceInfo.Category1 === "Electricity") {
          this.deviceInfo.Category1 = "电";
        } else if (this.deviceInfo.Category1 === "Gas") {
          this.deviceInfo.Category1 = "气";
        }
        this.setText();
      });

      const querydata = {
        Time: this.formatToYearDay(this.dayTime, "YYYY-MM-DD"),
        DeviceID: this.deviceInfo.Id,
      };
      if (this.deviceInfo.Category1 === "水") {
        // this.monthUnit = "m³";
        // await getDevicesDayReportToWater(querydata).then((res) => {
        //   this.objConsumptionDay = res.data;
        // });
      } else if (
        this.deviceInfo.Category1 === "电" ||
        this.deviceInfo.Category1 === "Electricity"
      ) {
        this.monthUnit = "kW·h";
        await getDevicesDayReportToElectricity(querydata).then((res) => {
          this.objConsumptionDay = res.data;
        });
      } else if (
        this.deviceInfo.Category1 === "气" ||
        this.deviceInfo.Category1 === "Gas"
      ) {
        this.monthUnit = "m³";
        await getDevicesDayReportToGas(querydata).then((res) => {
          this.objConsumptionDay = res.data;
        });
      }
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArray = this.objConsumptionDay.map((item) => {
        return item.Hour.split(" ")[1];
      });
      const DosageArrray = this.objConsumptionDay.map((item) => item.Dosage);
      this.totalConsumptioDay = DosageArrray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptioDay = (
        this.totalConsumptioDay / DosageArrray.length
      ).toFixed(2);
      let baroption = {
        title: {
          text:
            "总用" +
            this.deviceInfo.Category1 +
            "量：" +
            this.totalConsumptioDay +
            " " +
            this.monthUnit +
            "  日均用" +
            this.deviceInfo.Category1 +
            "量： " +
            this.avgConsumptioDay +
            " " +
            this.monthUnit,
        },
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   data: ["用" + this.deviceInfo.Category1 + "量"],
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
            // name: "用" + this.deviceInfo.Category1 + "量",
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
      baroption.xAxis[0].data = dayArray;
      baroption.series[0].data = DosageArrray;

      if (barChart != null && barChart != "" && barChart != undefined) {
        barChart.dispose(); //销毁
      }
      barChart = echarts.init(
        document.getElementById("echarts-bar-chart-daily")
      );

      barChart.setOption(baroption); // 初始化

      window.onresize = barChart.resize;
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