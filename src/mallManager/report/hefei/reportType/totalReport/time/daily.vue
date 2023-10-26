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

    <div
      id="echarts-bar-Consumption-daily"
      style="width: 100%; height: 500px"
    ></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="dailyText2 !== null">
      {{ dailyText2 }}
      <el-divider></el-divider>
    </div>

    <div id="echarts-bar-device-daily" style="width: 100%; height: 500px"></div>

    <el-divider></el-divider>

    <div class="dashboard-text" v-if="dailyText3 !== null">
      {{ dailyText3 }}
      <el-divider></el-divider>
    </div>

    <div
      id="echarts-bar-ingredient-daily"
      style="width: 100%; height: 500px"
    ></div>

    <div id="pageDetail" v-show="detailShow">
      详细数据
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50" align="center" />
        <!-- <el-table-column prop="ID" label="日期" width="180"> </el-table-column> -->
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
  // getAllDevicesDayReportToWater,
  getAllDevicesDayReportToElectricity,
  getAllDevicesDayReportToGas,
  // getSortDevicesDayReportToWater,
  getSortDevicesDayReportToElectricity,
  getSortDevicesDayReportToGas,
  // getIngredientDevicesDayReportToWater,
  getIngredientDevicesDayReportToElectricity,
  getIngredientDevicesDayReportToGas,
  // getAllDevicesDayReportToWaterDetail,
  getAllDevicesDayReportToElectricityDetail,
  getAllDevicesDayReportToGasDetail,
} from "@/api/hefei";
import dayjs from "dayjs";
// 全局变量
let barChart;
let barDeviceChart;
let pieChart;
export default {
  props: {
    dayTime: Date,
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
      // deviceInfo: {},
      dayText1: "",
      dailyText2: "",
      dailyText3: "",
      //   周报表 用水/电/气量对象
      objConsumptionDay: [],
      //   周报表 排序 用水/电/气量对象
      objSortConsumptionDay: [],
      //   周报表 成分图 用水/电/气量对象
      objIngredientConsumptionDay: [],
      //   总用量
      totalConsumptionDay: 0,
      //   平均用量
      avgConsumptionDay: 0,
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
      // if (!this.detailShow) {
      const time = this.formatToYearDay(this.dayTime, "YYYY-MM-DD");

      const querydata = {
        Time: time + "",
      };
      if (this.$route.meta.Name === "水") {
        await getAllDevicesDayReportToWaterDetail(querydata).then((res) => {
          this.tableData = Array.isArray(res.data) ? res.data : [];
        });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        await getAllDevicesDayReportToElectricityDetail(querydata).then(
          (res) => {
            this.tableData = Array.isArray(res.data) ? res.data : [];
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        await getAllDevicesDayReportToGasDetail(querydata).then((res) => {
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
      // }
    },
    init() {
      this.setEchartsByDay();
      // this.setText();
    },

    formatToYearDay(time, formatStr) {
      // 创建一个 dayjs 实例
      const specifiedTime = dayjs(time);

      return specifiedTime.format(formatStr);
    },
    // formatDayOfDay(time, formatStr) {
    //     // 创建一个 dayjs 实例
    //     //   const specifiedTime = dayjs(time);

    //     return dayjs(time).startOf(formatStr);
    // },
    setText() {
      this.dayText1 =
        this.formatToYearDay(this.dayTime, "YYYY年MM月DD日") +
        "用" +
        this.$route.meta.Name +
        "量日报表";
      this.dailyText2 =
        this.formatToYearDay(this.dayTime, "YYYY年MM月DD日") +
        "设备用" +
        this.$route.meta.Name +
        "排序图";
      this.dailyText3 =
        this.formatToYearDay(this.dayTime, "YYYY年MM月DD日") +
        "用" +
        this.$route.meta.Name +
        "成分图";
    },
    async setEchartsByDay() {
      const time = this.formatToYearDay(this.dayTime, "YYYY-MM-DD");

      const querydata = {
        Time: time + "",
      };
      if (this.$route.meta.Name === "水") {
        // this.monthUnit = "m³";
        // await getAllDevicesDayReportToWater(querydata).then((res) => {
        //   this.objConsumptionDay = res.data;
        // });
        // await getSortDevicesDayReportToWater(querydata).then((res) => {
        //   this.objSortConsumptionDay = res.data;
        // });
        // await getIngredientDevicesDayReportToWater(querydata).then((res) => {
        //   this.objIngredientConsumptionDay = res.data;
        // });
      } else if (
        this.$route.meta.Name === "电" ||
        this.$route.meta.Name === "Electricity"
      ) {
        this.monthUnit = "kW·h";
        await getAllDevicesDayReportToElectricity(querydata).then((res) => {
          this.objConsumptionDay = res.data;
        });

        await getSortDevicesDayReportToElectricity(querydata).then((res) => {
          this.objSortConsumptionDay = res.data;
        });
        await getIngredientDevicesDayReportToElectricity(querydata).then(
          (res) => {
            this.objIngredientConsumptionDay = res.data;
          }
        );
      } else if (
        this.$route.meta.Name === "气" ||
        this.$route.meta.Name === "Gas"
      ) {
        this.monthUnit = "m³";
        await getAllDevicesDayReportToGas(querydata).then((res) => {
          this.objConsumptionDay = res.data;
        });

        await getSortDevicesDayReportToGas(querydata).then((res) => {
          this.objSortConsumptionDay = res.data;
        });

        await getIngredientDevicesDayReportToGas(querydata).then((res) => {
          this.objIngredientConsumptionDay = res.data;
        });
      }
      this.setText();
      // console.log("this.objConsumptionDay", this.objConsumptionDay);
      // 取出 "Day", "Dosage" 字段并形成数组
      const dayArray = this.objConsumptionDay.map((item) => {
        return item.Hour.split(" ")[1];
      });
      const DosageArrray = this.objConsumptionDay.map((item) => item.sumDosage);

      // 排序
      const deviceSortArray = this.objSortConsumptionDay.map(
        (item) => item.Name
      );
      const DosageSortArrray = this.objSortConsumptionDay.map((item) =>
        item.sumDosage.toFixed(2)
      );
      // 成分
      const deviceIngredientArray = this.objIngredientConsumptionDay.map(
        (item) =>
          item.Catalog2 + "--" + item.DosageRatio + "--" + item.DosageRatio
      );
      const DosageIngredientArrray = this.objIngredientConsumptionDay.map(
        (item) => {
          return {
            value: item.sumDosage,
            name: item.Catalog2 + "--" + item.DosageRatio,
          };
        }
      );
      this.totalConsumptionDay = DosageArrray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ).toFixed(2);
      this.avgConsumptionDay = (
        this.totalConsumptionDay / DosageArrray.length
      ).toFixed(2);
      let baroption = {
        title: {
          text:
            "总用" +
            this.$route.meta.Name +
            "量：" +
            this.totalConsumptionDay +
            " " +
            this.monthUnit +
            "  日均用" +
            this.$route.meta.Name +
            "量： " +
            this.avgConsumptionDay +
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
      //   //   console.log("DosageIngredientArrray=>", DosageIngredientArrray);
      pieoption.series[0].data = DosageIngredientArrray;

      if (barChart != null && barChart != "" && barChart != undefined) {
        barChart.dispose(); //销毁
      }
      barChart = echarts.init(
        document.getElementById("echarts-bar-Consumption-daily")
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
        document.getElementById("echarts-bar-device-daily")
      );

      barDeviceChart.setOption(barDeviceoption);

      window.onresize = barDeviceChart.resize;
      if (pieChart != null && pieChart != "" && pieChart != undefined) {
        pieChart.dispose(); //销毁
      }
      pieChart = echarts.init(
        document.getElementById("echarts-bar-ingredient-daily")
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