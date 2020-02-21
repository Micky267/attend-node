<template>
  <div class="login">
      <div class="container">
          <div class="title">高校考勤系统</div>
          <div id="darkbannerwrap"></div>
          <el-form :label-position="labelPosition" >
            <el-form-item >
              <el-input v-model="userId" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="role">
                <el-radio label="1" >学生</el-radio>
                <el-radio label="2" >老师</el-radio>
                <el-radio label="3" >管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()" style="background-color: #189F92;width:100%;" >登录</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" @click="upDatas()" style="background-color: #189F92;width:100%;" >上传数据</el-button> -->
      </div>
  </div>
</template>

<script>
  // import jsonData from '../databaseData/attendance.json'
export default {
  name: "curNav",
  data(){
      return {
        labelPosition: 'right',
        userId: '',
        password: '',
        role: '1',
        data:'',
      }
  },
  methods:{
    submitForm(){
      console.log("this",this.role)
      sessionStorage.setItem('userId', this.userId);
      this.GLOVAL.userId = this.userId;
      console.log('role', this.role)
      console.log('role', Number(this.role))
      this.$http.get('/api/user/login',{
        params:{
          sid: this.userId,
          pw: this.password,
          role: Number(this.role)
        }
      })
      .then(res=>{
        if(res.data.message == "success"){
          switch(this.role){
        case '1':
         this.$router.push('user/student')
         sessionStorage.setItem('role', 1);
         break 
        case '2':
         this.$router.push('user/teacher')
         sessionStorage.setItem('role', 2);
         break 
        case '3':
         this.$router.push('user/admin')
         sessionStorage.setItem('role', 3);
         break 
         default:
           return
      }
        }
        else{
          this.$message.warning('密码错误！')
        }
      })
      .catch(error=>{
        console.error('错误！',error)
      })

    },
    upDatas(){
      //生成数据
      // this.$http.get('/database/teacherClassStudent')
      // .then((res)=>{
      //   console.log(res)
      //   document.write(JSON.stringify(res.data.data))
      // })
      // var list = JSON.parse(jsonData)

      // var oneList =  jsonData.slice(0,1000)
      // var twoList =  jsonData.slice(1000,2000)
      // var threeList =  jsonData.slice(2000,3000)
      // var foreList =  jsonData.slice(3000,4000)
      // var firfList =  jsonData.slice(4000)
      // 发送数据添加到数据库
      // this.$http.post('/api/addAttendance',{jsonData:firfList})
      //   .then((res)=>{
      //     console.log('后台请求的数据',res)
      //   })
    }
  }
}
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    position: relative;
    background: url(../assets/img/bg.png) no-repeat center;
    background-size: cover;
}
.container{
    box-sizing: border-box;
    width: 420px;
    height: 420px;
    background-color: #fff;
    position: absolute;
    margin:120px auto 0 auto;
    left: 0;
    right: 0;
    padding: 40px;
    border-radius: 10px;
}
.container .title{
    background-color: #189F92;
    padding: 18px 10px 18px 60px;
    margin: 10px 0 0 -58px;
    color: #fff;
}
.container #darkbannerwrap{
    background: url(../assets/img/aiwrap.png);
    width: 18px;
    height: 10px;
    margin: 0 0 20px -58px;
    position: relative;
}
</style>
