<template>
  <div class="nav-side">
    <ul class="wrap-menu" id="menu">
      <li v-for="(items,index) in menuList" :key="index">
        <a href="javascript:" class="link" :class="{'active':curMenuIndex==index&&curSubMenuIndex==-1}" @click="onWrapMenu(items,index)">
          <i :class="[items.icon]" class="fa left"></i>
          <span>{{items.title}}</span>
          <i class="fa fa-chevron-right right" :class="{'fa-chevron-down':(ifOpen&&curMenuIndex==index&&!items.path)}"></i>
        </a>
        <ul :style="{maxHeight:((ifOpen&&curMenuIndex==index)||(false)?'150px':0)}" class="sub-menu">
          <li v-for="(item,index2) in items.content" :key="index2">
            <a class="link" href="javascript:" :class="{'active':curSubMenuIndex==index2&&curMenuIndex==index}" @click="onSubMenu(item,index2)" to="/echat-attend">
              <i class="fa left fa-angle-right"></i>
              <span>{{item.title}}</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "navSide",
  data() {
    return {
      menuList: [],
      ifOpen: true,
      curMenuIndex: 0,
      curSubMenuIndex: 0,
      ifInit:true
    };
  },
  mounted(){
    const navOne =  sessionStorage.getItem('navOne');
    const navTwo =  sessionStorage.getItem('navTwo');
    const role =  sessionStorage.getItem('role');
    switch(role){
      case '1':
       this.menuList = stuMenuList
       this.curSubMenuIndex = -1
       break
      case '2':
       this.menuList = teaMenuList
       break
      case '3':
       this.menuList = adminMenuList
       break
       default:
        console.log('没有进去角色定位！session存的role',role);
        return;
     }
     if(navOne){
       this.curMenuIndex = navOne
       this.curSubMenuIndex = navTwo
     }
  },
  methods: {
    onWrapMenu: function(item,index) {
      //点击一级菜单时，二级菜单默认为-1
      sessionStorage.setItem('navTwo',-1)
      sessionStorage.setItem('navOne',index)
      if (this.curMenuIndex == index && this.ifOpen == true) {
        this.ifOpen = false;
      } else {
        this.ifOpen = true;
      }
      this.curMenuIndex = index;
      this.curSubMenuIndex = -1;
      if(item.path){
        this.$emit('setNavTitle')
        sessionStorage.setItem('navTitle',item.title)
        this.$router.push(item.path);
      }
    },
    onSubMenu: function(item, index) {
      sessionStorage.setItem('navTwo',index)
      this.curSubMenuIndex = index;
      this.$emit('setNavTitle')
      sessionStorage.setItem('navTitle',item.title)
      this.$router.push(item.path);
    }
  }
};



const stuMenuList = [
  {
    title: "个人考勤",
    icon: "fa-bar-chart ",
    path: "/user/student/my-attend",
  },
  {
    title: "其它功能",
    icon: "fa-list ",
    path: "",
    content: [
      {
        path: "/user/student/other",
        title: "待添加"
      },
    ]
  }
]

const teaMenuList = [
  {
    title: "查看考勤",
    icon: "fa-list ",
    path:"",
    content: [
      {
       title: "考勤记录",
       path: "/user/teacher/attend-record",
      }
    ]
  },
  {
    title: "开始考勤",
    icon: "fa-bar-chart",
    path: "/user/teacher/attend-init",
  },
]

const adminMenuList = [
  {
    title: "查看考勤",
    icon: "fa-bar-chart ",
    path: "",
    content: [
      {
        path: "/user/admin/statistics",
        title: "考勤统计表"
      },
    ]
  },
  {
    title: "用户信息",
    icon: "fa-list ",
    path: "",
    content: [
      {
        title: "学生信息",
        path: "/user/admin/stu-datas",
      },
      {
        title: "老师信息",
        path: "/user/admin/tea-datas",
      },
    ]
  }
]
</script>

<style stope>
.fa {
  display: inline-block;
  margin-top: 5px;
}
.fa.right {
  float: right;
}
.fa.left {
  margin: 0 10px;
}
.nav-side {
  height: 629px;
  position: relative;
  width: 100%;
  background-color: rgb(238, 238, 238);
}
.wrap-menu,
.wrap-menu > li {
  width: 100%;
}

.wrap-menu > li {
  font-size: 14px;
}
/* .wrap-menu > li:hover .sub-menu {
  max-height: 150px;
} */
.wrap-menu > li .sub-menu {
  -webkit-transition: max-height 1s ease-out;
  max-height: 0px;
  overflow: hidden;
}

.wrap-menu .link {
  box-sizing: border-box;
  width: 100%;
  display: block;
  padding: 10px 15px;
  color: #333;
}
/* .wrap-menu > li router-link {
  box-sizing: border-box;
  width: 100%;
  display: block;
  padding: 10px 15px;
  color: #333;
} */

.sub-menu > li router-link {
  padding: 12px 15px 12px 30px;
}

.active {
  background-color: rgb(0, 150, 136);
}
</style>
