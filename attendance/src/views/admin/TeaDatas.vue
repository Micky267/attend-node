<template>
  <div class="teacher-datas">
    <el-form :inline="true">
      <el-form-item label="学工号"><el-input type="text" v-model="selectTid"/></el-form-item>
      <el-form-item><el-button @click="selectFn" type="primary">查询</el-button></el-form-item>
    </el-form>
    <el-table :data="teaData" border style="width: 100%" >
      <!-- <el-table-column prop="yearSemester" label="学期" width="180"></el-table-column> -->
      <el-table-column prop="sid" label="学工号" width="120"></el-table-column>
      <el-table-column prop="sName" label="姓名" width="88"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="changePW(scope.row)">修改密码</el-button></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectTid:'',
      teaData:[],
    }
  },
  mounted(){
  },
  methods:{
    selectFn(){
      console.log(this.selectTid)
      this.$http.get('/api/admin/getTeacher',{
        params:{
          sid: this.selectTid
        }})
      .then((res)=>{
        console.log('res',res)
        if(res.data.status == "200"){
          this.teaData = res.data.data
        }
      })
      .catch((error=>{
        console.log('错误！',error)
      }))  
    },
    //修改密码
    changePW(row){
      this.$prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$http.post('/api/user/updatePW',{
            sid: row.sid,
            pw: value,
            role: 2
          })
          .then((res)=>{
            console.log('修改密码结果',res)
            if(res.data.code == 200){
              this.$message({
                type: 'success',
                message: '修改成功'
            });
            }
          })
          .catch(error=>{
            console.error('错误！',error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
    }
  }
};
</script>

<style scoped>
</style>
