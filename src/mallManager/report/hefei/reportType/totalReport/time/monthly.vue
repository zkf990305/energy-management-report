<template>
  <div class="dashboard-container">
    <div class="dashboard-text" v-if="monthText1 !== null">
      {{ monthText1 }}
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
      id="echarts-bar-Consumption-month"
      style="width: 100%; height: 500px"
    ></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="monthText2 !== null">
      {{ monthText2 }}
      <el-divider></el-divider>
    </div>

    <div id="echarts-bar-device-month" style="width: 100%; height: 500px"></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="monthText3 !== null">
      {{ monthText3 }}
      <el-divider></el-divider>
    </div>

    <div
      id="echarts-bar-ingredient-month"
      style="width: 100%; height: 500px"
    ></div>
    <el-divider></el-divider>
    <!-- <el-divider></el-divider> -->
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
  // getAllDevicesMonthReportToWater,
  getAllDevicesMonthReportToElectricity,
  getAllDevicesMonthReportToGas,
  // getSortDevicesMonthReportToWater,
  getSortDevicesMonthReportToElectricity,
  getSortDevicesMonthReportToGas,
  // getIngredientDevicesMonthReportToWater,
  getIngredientDevicesMonthReportToElectricity,
  getIngredientDevicesMonthReportToGas,
  // getAllDevicesMonthReportToWaterDetail,
  getAllDevicesMonthReportToElectricityDetail,
  getAllDevicesMonthReportToGasDetail,
} from "@/api/hefei";
import dayjs from "dayjs";
// 全局变量
let barChart;
let barDeviceChart;
let pieChart;
export default {
  props: {
    monthTime: Date,
    // queryInfo: Object,
  },
  mounted() {
    this.init();
    // this.ShowDetail();
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
      // deviceInfo: {},
      monthText1: "",
      monthText2: "",
      monthText3: "",
      //   月报表 用水/电/气量对象
      objConsumptionMonth: [],
      //   月报表 排序 用水/电/气量对象
      objSortConsumptionMonth: [],
      //   月报表 成分图 用水/电/气量对象
      objIngredientConsumptionMonth: [],
      //   总用量
      totalConsumptionMonth: 0,
      //   平均用量
      avgConsumptionMonth: 0,
      // 单位
      monthUnit: "kW·h",
    };
  },
  watch: {
    // 监听currentTime属性的改变
    monthTime(newVal, oldVal) {
      this.setEchartsByMonth();
    },
  },
  methods: {
    formatTime(row) {
      // 获取 Time 字段的原始值
      const time = row.Time;

      return dayjs(time).format("YYYY-MM-DD HH:mm:ss"); // 假设想要使用本地化的日期时间格式
    },
    async ShowDetail() {
      // this.detailShow = !this.detailShow;
      // if (this.detailShow) {
      let querydata = {
        Year: this.formatToYearMonth(this.monthTime, "YYYY"),
        Month: this.formatToYearMonth(this.monthTime, "MM"),
      };
      if (this.$route.meta.Name === "水") {
        await getAllDevicesMonthReportToWaterDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        await getAllDevicesMonthReportToElectricityDetail(querydata).then(
          (res) => {
            this.tableData = Array.isArray(res.data) ? res.data : [];
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        await getAllDevicesMonthReportToGasDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      }
      // }
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
      this.setEchartsByMonth();
      // this.setText();
    },
    formatToYearMonth(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },
    setText() {
      this.monthText1 =
        this.formatToYearMonth(this.monthTime, "YYYY年MM月") +
        "用" +
        this.$route.meta.Name +
        "量月报表";
      this.monthText2 =
        this.formatToYearMonth(this.monthTime, "YYYY年MM月") +
        "设备用" +
        this.$route.meta.Name +
        "排序图";
      this.monthText3 =
        this.formatToYearMonth(this.monthTime, "YYYY年MM月") +
        "用" +
        this.$route.meta.Name +
        "成分图";
    },
    async setEchartsByMonth() {
      const querydata = {
        Year: this.formatToYearMonth(this.monthTime, "YYYY"),
        Month: this.formatToYearMonth(this.monthTime, "MM"),
      };
      if (this.$route.meta.Name === "水") {
        this.monthUnit = "m³";
        await getAllDevicesMonthReportToWater(querydata).then((res) => {
          this.objConsumptionMonth = res.data;
        });
        // await getAllDevicesMonthReportToWaterDetail(querydata).then((res) => {
        //   console.log("res=>", res.data);
        // });

        await getSortDevicesMonthReportToWater(querydata).then((res) => {
          this.objSortConsumptionMonth = res.data;
        });
        await getIngredientDevicesMonthReportToWater(querydata).then((res) => {
          this.objIngredientConsumptionMonth = res.data;
        });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        this.monthUnit = "kW·h";
        await getAllDevicesMonthReportToElectricity(querydata).then((res) => {
          // console.log("getAllModelDevicesMonthReportToElectricit=>", res);
          this.objConsumptionMonth = res.data;
        });

        await getSortDevicesMonthReportToElectricity(querydata).then((res) => {
          this.objSortConsumptionMonth = res.data;
        });

        await getIngredientDevicesMonthReportToElectricity(querydata).then(
          (res) => {
            // console.log("getIngredientDevicesMonthReportToElectricity=>", res);
            this.objIngredientConsumptionMonth = res.data;
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        this.monthUnit = "m³";
        await getAllDevicesMonthReportToGas(querydata).then((res) => {
          this.objConsumptionMonth = res.data;
        });

        await getSortDevicesMonthReportToGas(querydata).then((res) => {
          this.objSortConsumptionMonth = res.data;
        });

        await getIngredientDevicesMonthReportToGas(querydata).then((res) => {
          this.objIngredientConsumptionMonth = res.data;
        });
      }
      this.setText();
      // console.log("his.objConsumptionMonth=>", this.objConsumptionMonth);
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArray = this.objConsumptionMonth.map((item) => item.Day);
      const DosageArrray = this.objConsumptionMonth.map(
        (item) => item.DosageSum
      );
      // 排序
      const deviceSortArray = this.objSortConsumptionMonth.map(
        (item) => item.DeviceName
      );
      const DosageSortArrray = this.objSortConsumptionMonth.map((item) =>
        item.Dosage.toFixed(2)
      );
      // // 成分
      const deviceIngredientArray = this.objIngredientConsumptionMonth.map(
        (item) =>
          item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
      );
      const DosageIngredientArrray = this.objIngredientConsumptionMonth.map(
        (item) => {
          return {
            value: item.SumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        }
      );

      this.totalConsumptionMonth = DosageArrray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionMonth = (
        this.totalConsumptionMonth / DosageArrray.length
      ).toFixed(2);
      let baroption = {
        title: {
          text:
            "总用" +
            this.$route.meta.Name +
            "量：" +
            this.totalConsumptionMonth +
            " " +
            this.monthUnit +
            "  日均用" +
            this.$route.meta.Name +
            "量： " +
            this.avgConsumptionMonth +
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

      pieoption.series[0].data = DosageIngredientArrray;

      if (barChart != null && barChart != "" && barChart != undefined) {
        barChart.dispose(); //销毁
      }
      barChart = echarts.init(
        document.getElementById("echarts-bar-Consumption-month")
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
        document.getElementById("echarts-bar-device-month")
      );

      barDeviceChart.setOption(barDeviceoption);

      window.onresize = barDeviceChart.resize;
      if (pieChart != null && pieChart != "" && pieChart != undefined) {
        pieChart.dispose(); //销毁
      }
      pieChart = echarts.init(
        document.getElementById("echarts-bar-ingredient-month")
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