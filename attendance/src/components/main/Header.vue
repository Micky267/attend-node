
<template>
  <div class="header">
    <span>教师考勤管理系统</span>
    <div class="drop-menu">
      <DropMenu />
    </div>
  </div>
</template>
<script>
import DropMenu from "./DropMenu"
export default {
  name:"app-header",
  components:{
    DropMenu
  }
};
</script>

<style scoped>
.header{
  height: 100%;
  width: 100%;
  background-color: #222;
  position: relative;
}
.header span{
  position: absolute;
  left: 50px;
  color: #fff;
  line-height: 45px;
}

.drop-menu{
  position: absolute;
  right: 10px;
  width: 80px;
  line-height: 45px;
}
</style>