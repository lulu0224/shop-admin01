<template>
    <el-dropdown @command="logout">
          <span>
            {{username}}
            <i class="el-icon-setting"></i>
          </span>
          <!--下拉菜单  -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
</template>
<script>
export default {
  props:{
    username:{
      require:true,
      type:String
    }
  },
  methods: {
  logout(){
    this.$store.commit("clearInfo");
    this.$router.replace("/login")
  }
  },
}
</script>