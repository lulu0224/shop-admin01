<template>
  <div class="login-bg">
    <div class="login-container">
      <el-form :model="ruleForm" :rules="rules" ref="loginForm">
        <h2>登 &nbsp;&nbsp;&nbsp;录</h2>
        <el-form-item prop="username" label>
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label>
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form>
          <el-button type="primary" @click="submit('loginForm')">登录</el-button>
        </el-form>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  methods: {
      ...mapMutations(["setInfo"]),
      submit(loginForm){
          this.$refs[loginForm].validate(value=>{
              if(!value){
                  return false
              }
              this.$http.post(this.$api.USERLOGIN,this.ruleForm).then(res=>{
                  console.log(res);
                  if(res.code == 200){
                      this.setInfo({token:res.list.token,info:res.list});
                      this.$router.replace("/index")
                  }else{
                       this.$message.error(res.msg);
                  }
              })
          })
      }
  },
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { 
              required: true, 
              message: "请输入用户名", 
              trigger: "blur" 
            },
          {
            pattern: /^\S{4,8}$/,
            message: "请输入4-8位非空字符",
            trigger: "blur",
          },
        ],
        password: [
          { 
              required: true, 
              message: "请输入密码", 
              trigger: "blur"
            },
          {
            pattern: /^\S{5,8}$/,
            message: "请输入5-8位非空字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>
<style lang="less">
.login-bg {
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login-container {
    width: 300px;
    height: 250px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    h2 {
      color: #fff;
      text-align: center;
      font-weight: 600;
      margin-bottom: 20px;
    }
    button{
        width: 100%;
    }
  }
}
</style>