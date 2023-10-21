// 设备级别父页面
<template>
  <div class="dashboard-container">
    <report />
    <!-- <report :queryInfo="routeData" /> -->
  </div>
</template>

<script>
import Report from "@/mallManager/report/hefei/reportType/index.vue";
export default {
  components: { Report },
  data() {
    return {
      // routeData: {
      //   ID: 0,
      //   Name: "",
      //   Building: 0,
      // },
    };
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      // this.routeData = this.$route.meta;
      // console.log(this.routeData);
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