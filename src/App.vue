<template>
  <div id="app">
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.addEventListener("unload", this.saveState);
    // console.log()
  },
  computed: {
    key() {
      return this.$route.name
        ? this.$route.name + new Date()
        : this.$route + new Date();
    },
  },
  methods: {
    saveState() {
      console.log("-unload");
    },
  },
};
</script>
