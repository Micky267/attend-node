
<template>
  <div>
    <b-container class="bv-example-row">
      <!-- Stack the columns on mobile by making one full-width and the other half-width -->
      <b-row>
        <b-col class="col" md="4" sm="8">cols="1" md="4"</b-col>
        <b-col class="col" md="8" sm="4">cols="1" md="4"</b-col>
      </b-row>

      <!-- <b-row>
        <b-col class="col">cols="1" md="4"</b-col>
        <b-col class="col">cols="1" md="4"</b-col>
      </b-row>-->
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      screenWidth: document.body.clientWidth
    };
  },
  watch: {
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          console.log("666");
          this.timer = false;
        }, 400);
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  }
};
</script>

<style scoped>
.col {
  border: 1px solid #000;
}
</style>