<template>
  <div class="attend-init">
    <el-form :inline="true">
      <el-form-item label="教学班">
        <div class="block">
          <el-cascader :options="semesterList" :props="props" @change="handleChange"
            style="width: 400px;"></el-cascader>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="startFn">开始考勤</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        tcid: '',
        semesterList,
        selCourse: {
          year: -1,
          semester: -1,
          tcId: -1
        },
      }
    },
    computed: {
      //动态生成联级选择器内容
      props(){
        return {
          lazy: true,
          lazyLoad :(node, resolve) =>{
            var level = node.level
            if(level == 1){
             this.selCourse.year = node.data.value
              resolve(node);
            }
            if(level == 2){
             this.selCourse.semester = node.data.value
              this.$http.get('/api/teacher/getSemesterCourses',{
                params:{
                  // tId: this.GLOVAL.userId,
                  tId: '1001',
                  year: this.selCourse.year,
                  semester: this.selCourse.semester
                }
              })
              .then((res)=>{
                if(res.status == 200){
                  resolve(res.data.data);
                }
                else{
                  console.log('请求错误！',res.data.message)
                }
              })
            }
          }
        }
      },
    },
    methods: {
      //开始选择
      startFn() {
        if(this.selCourse.tcId == -1){
          this.$message({
            type: 'warning',
            message: '请选择教学班'
          });
        }
        else{
          this.$router.push('/user/teacher/teacher-attend/' + this.selCourse.tcId)
        }
      },

      handleChange(value) {
      if(value.length == 3){
        this.selCourse.tcId = value[2]
      }
      else{
        this.selCourse.tcId = -1
        this.$message.warning('请选择教学班！')
      }
    },
    },
  };


  const semesterList = [{
        value: '2016-2017',
        label: '2016-2017',
        children:[{
          value: '1',
          label: '第一学期'
        },{
          value: '2',
          label: '第二学期'
        }]},{
        value: '2017-2018',
        label: '2017-2018',
        children:[{
          value: '1',
          label: '第一学期'
        },{
          value: '2',
          label: '第二学期'
        }]},{
        value: '2018-2019',
        label: '2018-2019',
        children:[{
          value: '1',
          label: '第一学期'
        },{
          value: '2',
          label: '第二学期'
        }]
      },{
        value: '2019-2020',
        label: '2019-2020',
        children:[{
          value: '1',
          label: '第一学期'
        },{
          value: '2',
          label: '第二学期'
        }]
    }]
</script>

<style scoped>
</style>