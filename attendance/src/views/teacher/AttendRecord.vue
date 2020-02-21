<template>
  <div class="attend-record">
    <el-form :inline="true"  class="demo-form-inline" :rules="rules" ref="ruleForm">
      <el-form-item label="课程">
        <div class="block">
          <el-cascader
            :options = "semesterList"
            :props="props"
            @change="handleChange"
            style="width: 400px;"
            ></el-cascader>
        </div>     
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSelect('ruleForm')">查询</el-button>
      </el-form-item>
      <div class="block" style="float: right;">
        <el-form-item label="迟到扣分">
          <el-input type="text" v-model="lateScore" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="旷课扣分">
          <el-input type="text" v-model="truantScore"  style="width: 100px;"></el-input>
        </el-form-item>
      </div>

    </el-form>
    <el-table :data="courseList" border style="width: 100%" :row-style="{height:'50px'}" :cell-style="{padding:'0px'}">
      <!-- <el-table-column prop="yearSemester" label="学期" width="180"></el-table-column> -->
      <el-table-column prop="number" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.number+(curPage-1)*pageSize}}</span> 
          </template>
      </el-table-column>
     </el-table-column>
      <el-table-column prop="cName" label="课程" width="165"></el-table-column>
      <el-table-column prop="className" label="班级" width="225"></el-table-column>
      <el-table-column prop="stuId" label="学号" width="120"></el-table-column>
      <el-table-column prop="sName" label="姓名" width="88"></el-table-column>
      <el-table-column prop="attendTotal" label="考勤次数" width="80"></el-table-column>
      <el-table-column prop="normals" label="正常次数" width="80"></el-table-column>
      <el-table-column prop="lates" label="迟到次数" width="80"></el-table-column>
      <el-table-column prop="truants" label="旷课次数" width="80">
        <template slot-scope="scope">
         <span :class="{'truant-red':scope.row.truants>=3}">{{scope.row.truants}}</span> 
         </template>
      </el-table-column>
      <el-table-column prop="leaves" label="请假次数" width="80"></el-table-column>
      <el-table-column  label="考勤分" width="80">
        <template slot-scope="scope">
        <span :class="{'truant-red':scope.row.truants>=3}">{{100 - (scope.row.lates*lateScore+scope.row.truants*truantScore)}}</span> 
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detailFn(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next" :total="pageTotal" :page-size="pageSize" @current-change="pageChange" 
     :page-sizes="[10, 20, 50, 80]"  @size-change="handleSizeChange"   :current-page.sync="curPage"></el-pagination>
    <el-dialog title="课程考勤详情" :visible.sync="dialogTableVisible" width="40%" >
      <div style="padding-bottom:15px">{{detailTitle}} </div>
      <el-table :data="courseDetail" border height="300" >
        <el-table-column property="number" label="序号" width="150"></el-table-column>
        <el-table-column property="date" label="日期" width="180"></el-table-column>
        <el-table-column property="status" label="状态" >
          <template slot-scope="scope">
           <span :class="{
            'truant-red': scope.row.status==3,
            'normal-green': scope.row.status==1,
            'late-blue': scope.row.status==2,
          }">{{scope.row.status | getStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updateStatusFn(scope.row,scope.$index)">修改状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="修改考勤状态" :visible.sync="newStatusVisible" width="30%" >
      <el-radio-group v-model="newStatus" >
        <el-radio label="1" >正常</el-radio>
        <el-radio label="2" >迟到</el-radio></el-radio>
        <el-radio label="3" >旷课</el-radio>
        <el-radio label="4" >请假</el-radio>
      </el-radio-group>
      <el-button size="mini" type="primary" @click="saveStatus()" style="float: right; position: relative;bottom: 5px;">保存修改</el-button>
    </el-dialog>
  </div>
</template>

<script>
  let id = 0;
export default {
  name: "attendAttend",
  data() {
    return {
      curTcId:'-1', //当前获取到的教学班id
      semesterList,
      selCourse: {},
      dialogTableVisible: false,
      courseList: [],
      courseDetail: [],
      detailTitle:'',
      pageSize: 10,      
      pageTotal:-1,
      curPage:1,
      rules: {},
      lateScore: 1,  //迟到扣分
      truantScore: 5,  //旷课扣分
      newStatusVisible: false, //显示修改状态弹窗
      updateIndex:-1, //要修改状态的表格下表
      newStatus: -1,
      reqCurStatus:{  //更改当前状态
          tcsId : '',
          attendId : '',
          oldStatus : '',
          newStatus : this.newStatus
      },
    }
  },
  computed: {
    //获取老师所教课程的请求参数
      // reqData(){
      //   return {
      //     tId: this.GLOVAL.userId,
      //     page: this.curPage,
      //     size: this.pageSize,
      //     tcId: -1,
      //   }
      // },

      //动态生成级联选择器
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

      //修改状态的颜色
      statusColor(status){
        return {
          'truant-red': status==3,
          'normal-green': status==1,
          'late-blue': status==2,
        }
      }
    },filters: {
        getStatus: function (status) {
          switch(status){
              case 1:
              return '正常'
              case 2:
                return '迟到'
              case 3:
                return '旷课'
              case 4:
                return '请假'
              default :
              console.log('错误！',status)
              return '错误'
          }
        }
      },
  methods: {
    // 选择课程
    handleChange(value) {
      if(value.length == 3){
        this.selCourse.tcId = value[2]
        this.curTcId = value[2]
      }
      else{
        this.selCourse.tcId = -1
        this.$message.warning('请选择课程！')
      }
    },

    //查询
    onSelect(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      if(this.selCourse.tcId == -1){
        this.$message.warning('请选择课程！')
      }
      else{
      this.reqCourse()
      }
    },

    //点击查看详情
    detailFn(index, row) {
      this.dialogTableVisible = true
        this.$http.get(`/api/user/getCourseDetail?sid='${row.sid}'`)
          .then((res) => {
            console.log('请求详情拿到的结果', res)
            this.courseDetail = res.data.data
          })
          .catch((error) => {
            console.log('错误！',error);
          })
        this.detailTitle = `${row.stuId} ${row.sName} ${row.className}`
    },

    //查看详情——》修改状态
    updateStatusFn(row,index){
      this.newStatusVisible = true
      this.newStatus = row.status.toString()
      this.reqCurStatus.tcsId = row.tcsId
      this.reqCurStatus.attendId = row.sid
      this.reqCurStatus.oldStatus = row.status
      this.updateIndex = index
    },

    //查看详情——》修改状态——》保存修改
    saveStatus(){
      this.$confirm('是否确定保存?', '保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在保存...';
              this.reqCurStatus.newStatus =Number(this.newStatus) 
              this.$http.post('/api/teacher/updateStu',{reqCurStatus:this.reqCurStatus})
              .then((res)=>{
                //修改学生考勤详情数据
                this.courseDetail[this.updateIndex].status = Number(this.newStatus) 
                this.reqCourse()
                this.newStatusVisible = false
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              })
            } else {
             instance.confirmButtonLoading = false;
              done();
            }
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });          
        });
    },

    //当前页发生变化
    pageChange(page) {
      // this.reqData.page = page
      this.reqCourse();
    },

    //当前页size发生变化
    handleSizeChange(val) {
      this.pageSize = val
      this.reqCourse();
      //   console.log(`每页 ${val} 条`);
      },

    //发送请求获取课程数据
    reqCourse(){
     let reqData = { //请求当前页面课程的参数
          tId: this.GLOVAL.userId,
          page: this.curPage,
          size: this.pageSize,
          tcId: this.curTcId,
      }
      this.$http.get(`/api/user/getCourseList`,{
        params:reqData
      })
        .then((res) => {
          this.pageTotal = res.data.total
          this.courseList = res.data.data
          console.log('获取学生学期+课程请求的结果', res)
        })
        .catch((error)=>{
          console.log('错误！',error)
        })
    }
  },
  }
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
  .el-pagination{
    margin-top: 15px;
  }
  .truant-red{
    color: #f40;
  }
  .normal-green{
    color: green;
  }
  .late-blue{
    color:dodgerblue;
  }
</style>
