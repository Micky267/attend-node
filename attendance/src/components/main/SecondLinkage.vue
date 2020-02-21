<template>
  <div class="linkage">
    <select v-model="selectFrist" @change="selectFristFn($event)">
      <!--选择项的value值默认选择项文本 可动态绑定选择项的value值 更改v-model指令绑定数据-->
      <option disabled value selected>—请选择—</option>
      <option v-for="(item,index) in course" :value="item.c_name" :key="index">{{item.c_name}}</option>
    </select>
    <select v-model="selectSecond" @change="selectSecondFn($event)">
      <!--选择项的value值默认选择项文本 可动态绑定选择项的value值 更改v-model指令绑定数据-->
      <option disabled value selected>—请选择—</option>
      <option v-for="(item,index) in secondItems" :value="item.time" :key="index">{{item.time}}</option>
    </select>
    <el-button
      type="primary"
      icon="el-icon-search"
      size="mini"
      @click="$emit( 'getSelectDatas', selectFristIndex,selectSecondIndex)"
    >搜索</el-button>
    <!--选择项的value值-->
  </div>
</template>

<script>
export default {
  name: "SecondLinkage",
  data() {
    return {
      selectFrist: "", //选择框为空，则会显示默认值
      selectSecond: "",
      secondItems: [],
      selectFristIndex: -1,
      selectSecondIndex: -1
    };
  },
  computed: {},
  methods: {
    // 获取第一个select的下标，从而找到第二个对应的数据
    selectFristFn(e) {
      this.selectFristIndex = e.target.selectedIndex - 1;
      this.secondItems = this.course[this.selectFristIndex].times;
      this.selectSecond = "——请选择——"
    },
    selectSecondFn(e) {
      this.selectSecondIndex = e.target.selectedIndex - 1;
    }
  },
  props: {
    course: Array
  }
};
</script>

<style stope>
.linkage select {
  width: 150px;
  border: 1px solid rgb(169, 169, 169);
  margin-right: 10px;
  height: 30px;
  padding: 0 30px 0 10px;
  border-radius: 1px;
}

.linkage select option {
  padding: 5px;
}
</style>
