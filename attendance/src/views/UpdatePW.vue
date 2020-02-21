<template>
  <div class="update-pw">
      <div class="container">
          <div class="title">修改密码</div>
          <div id="darkbannerwrap"></div>
          <el-form :label-position="labelPosition" >
            <el-form-item >
              <el-input v-model="password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="rePassword" type="password" placeholder="请重复密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateFn()" style="background-color: #189F92;width: 30%;margin:10px 10px 0 50px;" >修改</el-button>
                <el-button type="danger" @click="returnFn()" style="width: 30%;" >返回</el-button>
            </el-form-item>
          </el-form>

      </div>
  </div>
</template>

<script>
export default {
  data(){
      return {
        labelPosition: 'right',
        rePassword: '',
        password: '',
      }
  },
  methods:{
    updateFn(){
      console.log('修改密码！')
      if(this.rePassword == this.password){
        console.log('密码一致！')
        this.$http.post('/api/user/updatePW',{
            sid: this.GLOVAL.userId,
            pw: this.password,
            role: Number(sessionStorage.getItem('role'))
          })
          .then((res)=>{
            console.log('修改密码结果',res)
            if(res.data.status == "200"){
            this.$router.push('/login')
              this.$message({
                type: 'success',
                message: '修改成功'
            });
            }
          })
          .catch(error=>{
            console.error('错误！',error)
          })
      }
      else{
        this.$message({
            type: 'warning',
            message: '密码不一致！'
          });
      }
    },
    returnFn(){
      this.$router.push('/login')
    }
  }
};
</script>

<style scoped>
.update-pw{
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
