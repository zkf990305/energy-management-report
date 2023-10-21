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
      id="echarts-bar-chart-week"
      v-if="objConsumptionweek !== []"
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
  getDevicesByID,
  getDevicesWeekReportToWater,
  getDevicesWeekReportToElectricity,
  getDevicesWeekReportToGas,
  getDevicesWeekReportToWaterDetail,
  getDevicesWeekReportToElectricityDetail,
  getDevicesWeekReportToGasDetail,
} from "@/api/hefei";
import dayjs from "dayjs";
// 全局变量
let barChart2;
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
      tableData: [],
      detailShow: false,
      deviceInfo: {},
      //   tempTime: Date,
      weekText1: "",
      //   周报表 用水/电/气量对象
      objConsumptionweek: [],
      //   总用量
      totalConsumptioweek: 0,
      //   平均用量
      avgConsumptioweek: 0,
      // 单位
      monthUnit: "kW·h",
    };
  },
  watch: {
    // 监听currentTime属性的改变
    weekTime(newVal, oldVal) {
      this.setEchartsByweek();
    },
  },
  methods: {
    formatTime(row) {
      // 获取 Time 字段的原始值
      const time = row.Time;

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss"); // 假设想要使用本地化的日期时间格式
    },
    async ShowDetail() {
      const time = this.formatWeekOfDay(this.weekTime, "week");
      const querydata = {
        Time: time,
        DeviceID: this.deviceInfo.Id,
      };
      if (this.deviceInfo.Category1 === "水") {
        await getDevicesWeekReportToWaterDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (
        this.deviceInfo.Category1 === "电" ||
        this.deviceInfo.Category1 === "Electricity"
      ) {
        await getDevicesWeekReportToElectricityDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (this.deviceInfo.Category1 === "气") {
        await getDevicesWeekReportToGasDetail(querydata).then((res) => {
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
      //   this.tempTime = this.weekTime;
      // console.log("this.$route.meta=>",this.$route.meta);
      this.setEchartsByweek();
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
    formatToYearweek(time, formatStr) {
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
        this.deviceInfo.Building +
        " " +
        this.deviceInfo.Name +
        "用" +
        this.deviceInfo.Category1 +
        "量周报表";
    },
    async setEchartsByweek() {
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

      const time = this.formatWeekOfDay(this.weekTime, "week");
      const weekdata = {
        Time: time,
        DeviceID: this.deviceInfo.Id,
      };
      if (this.deviceInfo.Category1 === "水") {
        this.monthUnit = "m³";
        await getDevicesWeekReportToWater(weekdata).then((res) => {
          this.objConsumptionweek = res.data;
        });
      } else if (
        this.deviceInfo.Category1 === "电" ||
        this.deviceInfo.Category1 === "Electricity"
      ) {
        this.monthUnit = "kW·h";
        await getDevicesWeekReportToElectricity(weekdata).then((res) => {
          this.objConsumptionweek = res.data;
        });
      } else if (this.deviceInfo.Category1 === "气") {
        this.monthUnit = "m³";
        await getDevicesWeekReportToGas(weekdata).then((res) => {
          this.objConsumptionweek = res.data;
        });
      }
      if (this.objConsumptionweek === []) {
        return;
      }
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArray = this.objConsumptionweek.map((item) => item.Day);
      const DosageArrray = this.objConsumptionweek.map((item) => item.Dosage);
      this.totalConsumptioweek = DosageArrray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptioweek = (
        this.totalConsumptioweek / DosageArrray.length
      ).toFixed(2);
      let baroption2 = {
        title: {
          text:
            "总用" +
            this.deviceInfo.Category1 +
            "量：" +
            this.totalConsumptioweek +
            " " +
            this.monthUnit +
            "  日均用" +
            this.deviceInfo.Category1 +
            "量： " +
            this.avgConsumptioweek +
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
      baroption2.xAxis[0].data = dayArray;
      baroption2.series[0].data = DosageArrray;

      // TODO: 月份 水 气 电
      if (barChart2 != null && barChart2 != "" && barChart2 != undefined) {
        barChart2.dispose(); //销毁
      }
      barChart2 = echarts.init(
        document.getElementById("echarts-bar-chart-week")
      );

      barChart2.setOption(baroption2);

      window.onresize = barChart2.resize;
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