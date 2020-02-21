<template>
  <div class="home">
    <el-container>
      <el-header style="padding:0px;height:45px"><app-header /></el-header>
        <el-container>
          <el-aside width="200px"><app-nav-side @setNavTitle="setNavTtile"/></el-aside>
          <el-container>
              <el-header style="padding:0px;height:45px"><app-curNav >{{navTitle}}</app-curNav></el-header>
              <el-main style="padding: 15px;">
                <div class="container">
                  <router-view />
                </div>
              </el-main>
          </el-container>
        </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "../components/main/Header";
import NavSide from "../components/main/NavSide";
import curNav from "../components/main/curNav";
export default {
  name: "home",
  data() {
    return {
      title:''
    };
  },
  computed: {
    navTitle(){
      //如果切换了菜单，那么session就会有记录，那么title就获取session里面的值
      const role = sessionStorage.getItem('role');
      const navTitle = sessionStorage.getItem('navTitle');
      if(navTitle){
        this.title = navTitle
      }
      else{
       switch(role){
        case "1":
        this.title = "个人考勤"
          break
        case "2":
        this.title = "考勤记录"
          break
        case "3":
        this.title = "考勤统计表"
          break
        default:
        this.title = "获取不到"      
       }
      }
      return  this.title
    }
  },
  components: {
    "app-header": Header,
    "app-nav-side":NavSide,
    "app-curNav":curNav,
  },
  methods: {
    //触发导航标题重新渲染
    setNavTtile(){
      this.title = ''
    },
  },

};
</script>

<style scoped>
.home{
  height: 100%;
}
.el-main .container{
  box-sizing: border-box;
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  padding: 10px;
}
</style>

