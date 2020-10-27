<template>
  <el-menu
    background-color="#20222A"
    :default-active="$route.path"
    unique-opened
  >
    <h2>后台管理系统</h2>
    <el-menu-item index="/index">
      <i class="el-icon-s-home"></i>
      <router-link to="/index">首页</router-link>
    </el-menu-item>
    <el-submenu
      v-for="(menu, index) in menus"
      :key="index"
      :index="(index+1).toString()"
    >
      <template slot="title">
        <i :class="menu.icon"></i>
        {{ menu.title }}
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="submenu.url"
          v-for="(submenu, index) in menu.children"
          :key="index"
        >
          <router-link :to="submenu.url">{{ submenu.title }}</router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  computed: {
    menus() {
      return this.$store.state.info.menus;
    },
  },
};
</script>
<style lang="less">
.el-menu {
  overflow-x: hidden;
  height: 100%;
  color: #fff;
  h2 {
    font-size: 16px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .el-menu-item {
     box-sizing: border-box;
    a {
      color: #fff;
    }
  }
  .el-submenu__title {
    color: #fff;
  }
  .el-menu-item.is-active {
    color: rgb(255, 208, 75);
    box-sizing: border-box;
  }
  .is-active {
    .router-link-exact-active {
      color: rgb(255, 208, 75);
    }
  }
}
</style>