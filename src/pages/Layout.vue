<template>
  <div class="layout">
    <el-container>
      <el-aside width="150px">
        <SideBar></SideBar>
      </el-aside>
      <el-container>
        <el-header height="50px">
          <MyHeader :username="username"></MyHeader>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import MyHeader from "@/components/MyHeader";
import SideBar from "@/components/SideBar";
export default {
  computed: {
    username() {
      return this.$store.state.info.username;
    },
  },
  methods: {},
  components: {
    MyHeader,
    SideBar,
  },
};
</script>
<style lang="less">
.layout{
  height: 100%;
  .el-container {
  height: 100%;
  .el-aside {
    height: 100%;
    color: #333;
    
  }
  .el-header {
    background: #b3c0d1;
    line-height: 50px;
    text-align: right;
  }
  .el-main {
    background: #e5e5e5;
  }
}
}
</style>