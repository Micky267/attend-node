<template>
  <div class="drop-menu" @mouseenter="ifShow=true" @mouseleave="ifShow=false">
    <div class="title"  >
      <span>账户</span>
      <i class="fa fa-angle-down"></i>
    </div>
    <transition name="fade">
      <ul v-show="ifShow"  @mouseleave="curIndex=-1">
        <li v-for="(item,index) in list" :key="index" @click="choose(index)" :class="{'active':curIndex==index}" @mouseover="curIndex=index">{{item}}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: "dropMenu",
  data() {
    return {
      list: ["修改密码", "退出"],
      ifShow: false,
      curIndex:-1,
    };
  },
  methods:{
    choose(index){
      if(index == 0){
        this.$router.push('/updatePW')
      }
      if(index == 1){
        sessionStorage.clear();
        this.$router.push('/login')
      }
      console.log('index',index)
    },
  },
};
</script>

<style stope>
.drop-menu {
  position: relative;
  color: aliceblue;
  cursor: pointer;
  font-size: 12px;
}
.drop-menu .title span {
    padding: 0 10px;
}
.drop-menu ul {
  position: absolute;
  top: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 999;
  top: 48px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,.12);
} 
.drop-menu ul li{
    padding: 0 10px;
    box-sizing: border-box;
    height: 38px;
    width: 100%;
}

.drop-menu ul li.active {
  background-color: rgb(0, 150, 136);
  color: #fff;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
