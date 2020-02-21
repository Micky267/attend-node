<template>
  <div class="nav-side">
    <ul class="wrap-menu" id="menu">
      <li v-for="(items,index) in menuList" :key="index">
        <a
          href="javascript:"
          class="link"
          :class="{'active':curMenuIndex==index&&curSubMenuIndex==-1}"
          @click="onWrapMenu(index)"
        >
          <i :class="[items.icon]" class="fa left"></i>
          <span>{{items.title}}</span>
          <i
            class="fa fa-chevron-right right"
            :class="{'fa-chevron-down':(ifOpen&&curMenuIndex==index)}"
          ></i>
        </a>
        <ul
          :style="{maxHeight:((ifOpen&&curMenuIndex==index)||(false)?'150px':0)}"
          class="sub-menu"
        >
          <li v-for="(item,index2) in items.content" :key="index2">
            <a
              class="link"
              href="javascript:"
              :class="{'active':curSubMenuIndex==index2&&curMenuIndex==index}"
              @click="onSubMenu(item,index2)"
              to="/echat-attend"
            >
              <i class="fa left fa-angle-right"></i>
              <span>{{item.text}}</span>
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
      menuList: [
        {
          title: "个人考勤",
          icon: "fa-bar-chart ",
          content: [
            {
              path: "/",
              text: "查看考勤"
            },
          ]
        },
        {
          title: "其它功能",
          icon: "fa-list ",
          content: [
            {
              path: "/apply-disposed",
              text: "待添加"
            },
            {
              path: "/apply-undispose",
              text: "未处理"
            }
          ]
        }
      ],
      ifOpen: true,
      curMenuIndex: 0,
      curSubMenuIndex: 0
    };
  },
  mounted(){
    sessionStorage.setItem('navTitle', '考勤统计');
  },
  methods: {
    onWrapMenu: function(index) {
      if (this.curMenuIndex == index && this.ifOpen == true) {
        this.ifOpen = false;
      } else {
        this.ifOpen = true;
      }
      this.curMenuIndex = index;
      this.curSubMenuIndex = -1;
    },
    onSubMenu: function(item, index) {
      this.curSubMenuIndex = index;
      //将导航标题添加到session中，用来在模块中显示标题
      this.$emit('setNavTitle',item.text)
      this.$router.push(item.path);
    }
  }
};
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
