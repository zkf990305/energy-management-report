// 汇总页面
<template>
  <div class="layout">
    <el-row>
      <el-col :span="4">
        <div class="block">
          <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            default-value
          >
          </el-date-picker>
          <span>
            <el-tooltip placement="top">
              <div slot="content">
                步骤: <br />
                1.选择日期(生成月报/周报时，<br />
                日期需要在指定月/周内。<br />
                如:生成6月报表，<br />可以选择6月任意一天)<br />
                2.在设备节点内选择水/电/气
                <br />可以制作汇总报表<br />
                也可以选择具体设备生成设备报表<br />
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </span>
        </div>
      </el-col>
      <el-col :span="20">
        <el-button type="primary" @click="printChartToPDF">存为PDF</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs
          type="border-card"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="月报表" name="first">
            <monthly
              :monthTime="value2"
              v-if="activeName === 'first'"
              id="print-container-first"
            />
            <!-- <monthly :monthTime="value2" :queryInfo="queryInfo" /> -->
          </el-tab-pane>
          <el-tab-pane label="周报表" name="second">
            <weekly
              :weekTime="value2"
              v-if="activeName === 'second'"
              id="print-container-second"
            />
          </el-tab-pane>
          <el-tab-pane label="日报表" name="third">
            <daily
              :dayTime="value2"
              v-if="activeName === 'third'"
              id="print-container-third"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Monthly from "./time/monthly.vue";
import Weekly from "./time/weekly.vue";
import Daily from "./time/daily.vue";
import { htmlPdf } from "@/utils/htmlToPDF.js";
export default {
  // props: {
  //   queryInfo: Object,
  // },
  components: { Monthly, Weekly, Daily },
  data() {
    return {
      activeName: "first",
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
      value2: new Date(),
    };
  },
  methods: {
    //切换标签页时触发
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    // 打印
    printChartToPDF() {
      let fileName = "报表";
      const fileList = document.getElementsByClassName(
        "print-container-" + this.activeName
      ); // 很重要
      htmlPdf(
        fileName,
        document.querySelector("#print-container-" + this.activeName),
        fileList
      );
    },
  },
};
</script>

<style>
</style>