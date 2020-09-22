<template>
  <div id="app">
    <canvas id="myCanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>

import Main from "@/js/main.js"

export default {
  data() {
    return {
      width: 0,
      height: 0
    }
  },
  mounted() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    new Main()
  }
}
</script>

<style lang="css">
html,body{
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>

