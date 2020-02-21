<template>
  <div class="teacher-attend">
    <el-form :inline="true">
      <el-form-item :label="couresMes"></el-form-item>
      <el-form-item :label="curDate" style="float: right;"></el-form-item>
    </el-form>
    <el-table :data="stuList" border style="width: 100%" :row-style="{height:'50px'}" :cell-style="{padding:'0px'}">
      <!-- <el-table-column prop="yearSemester" label="学期" width="180"></el-table-column> -->
      <el-table-column prop="number" label="序号" width="80"></el-table-column>
      <el-table-column prop="className" label="班级" width="215"></el-table-column>
      <el-table-column prop="stuId" label="学号" width="120"></el-table-column>
      <el-table-column prop="sName" label="姓名" width="88"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <!-- <el-radio-group v-model="status" @change="(label)=>{statusChange(scope.$index,label)}"> -->
            <el-radio-group v-model="reqList[scope.$index].status" @change="function(label){statusChange(scope.$index,label)}">
            <el-radio label="1" >正常</el-radio>
            <el-radio label="2" >迟到</el-radio></el-radio>
            <el-radio label="3" >旷课</el-radio>
            <el-radio label="4" >请假</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex"  justify="center" style="padding: 15px;">
      <el-button  type="primary" @click="saveFn" style="margin-right: 50px;" :disabled = "ifDisabled">保存</el-button>
      <el-button  type="danger" @click="returnFn()">返回</el-button>
    </el-row>
 
  </div>
</template>

<script>
export default {
  name: "teacher-attend",
  data(){
    return {
      stuList:[],
      reqList:[],
      couresMes:'',
      ifDisabled:false
    }
  },
  computed: {
    curDate:function(){
      return getCurDate()
    }
  },
  mounted() {
    console.log('来到初始化界面')
    this.reqStuDatas()
  },
  methods: {
    //页面初始获取学生数据
    reqStuDatas(){
      this.$http.get('/api/teacher/ifAttended',
      {params:{
        tcId: this.$route.params.id,
        date: this.curDate
      }})
      .then((res)=>{
        console.log('老师考勤获取某日期的学生数据',res)
        if(res.data.data.length != 0){
          this.ifDisabled = true
        }
      })

      this.$http.get('/api/teacher/getAttendStu',
      {
      params:{
        tcId:this.$route.params.id
      }})
      .then((res)=>{
        console.log('老师考勤获取的学生数据',res)
        const resData = res.data.data
        this.stuList = resData
        this.couresMes = `${resData[0].yearSemester} ${resData[0].cName} ${resData[0].tName}`
        resData.map((currentValue,index)=>{
          this.reqList.push(
            {
              tcsId:currentValue.sid,
              tcId:this.$route.params.id,
              date:this.curDate,
              status:'1'
            }
          )
        })
      })
    },
    //学生考勤状态单选按钮更改时
    statusChange(index,label){
      this.reqList[index].status = label
    },
    //保存考勤数据
    saveFn(){
      this.$confirm('是否确定保存?', '保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在保存...';
              this.$http.post('/api/teacher/addAttendance',{jsonData:this.reqList})
              .then((res)=>{
                console.log('后台返回的的数据',res)
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              })
            } else {
              done();
              instance.confirmButtonLoading = false;
            }
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        this.reqStuDatas()

          // this.$router.push('/user/teacher/attend-init/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });          
        });
      console.log('考勤后的数据',this.reqList)
    },
    //返回操作
    returnFn(){
      this.$confirm('是否确定返回?', '返回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$router.push('/user/teacher/attend-init/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消返回'
          });          
        });
    }
  },
};

const getCurDate =  function() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
};
</script>

<style scoped>
</style>
