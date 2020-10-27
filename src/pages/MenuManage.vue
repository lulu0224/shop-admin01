<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogFormVisible = true" >添加</el-button>
    <my-table :menulist="menulist" @changeMenu="changeMenuFn" @edit="editFn"></my-table>
    <!-- Form -->
    
    <el-dialog
      title="菜单添加"
      :visible.sync="dialogFormVisible"
      @open="gettopList"
      @close="reset"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="菜单级别"
          :label-width="formLabelWidth"
          prop="pid"
        >
          <el-select v-model="form.pid" placeholder="请选择" @change="changeMenu">
            <el-option label="顶级菜单" :value="0" :key="0"></el-option>
            <el-option
              :label="item.title"
              :value="item.id"
              v-for="item in topmenu"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="菜单名称"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          :label-width="formLabelWidth"
          v-if="form.pid == 0"
          prop="icon"
        >
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单地址"
          :label-width="formLabelWidth"
          v-else
          prop="url"
        >
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-radio v-model="form.type" :disabled="form.type!==1" :label="1">目录</el-radio>
          <el-radio v-model="form.type" :disabled="form.type===1" :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取pid为0的顶级菜单的数据
      topmenu: [],
      // 获取所有菜单的数据
      menulist: [],
      dialogFormVisible: false,
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      },
      formLabelWidth: "100px",
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        pid: [{required: true, message: "请选择菜单级别", trigger: "change" }],
        icon: [{ message: "请输入菜单图标", trigger: "blur" }],
        url: [{ message: "请输入菜单地址", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 点击提交按钮
    submitForm(formName) {
      let url = this.form.id?this.$api.MENUEDIT:this.$api.MENUADD;
      this.form.status = this.form.status ? 1 : 2;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
            return false;
        }
         this.$http.post(url, this.form).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.getList(); 
              this.dialogFormVisible = false;
              
            } else {
              this.$message.error(res.msg);
            }
          });
         
      });
    },
    //子组件点击编辑按钮时的操作
    editFn(scopeRow){
      this.dialogFormVisible = true;
      this.form = {
          ...scopeRow
      }
      this.form.status = this.form.status==1?true:false;
    },
    //重置操作
     reset() {
          this.form= {
            pid: 0,
            title: "",
            icon: "",
            type: 1,
            url: "",
            status: true
        }
      },
    // 切换菜单名是触发
    changeMenu(pid){
      this.form.type = pid >0?2:1;
    },
    //子组件某些操作需要使menulist重置
    changeMenuFn(menulist){
      this.menulist = menulist
    },

    // 向后台请求菜单的所有数据
    getList() {
      this.$http.get(this.$api.MENULIST, { istree: true }).then((res) => {
        if (res.code == 200) {
          this.menulist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 向后台请求pid为0 的菜单数据
    gettopList() {
      this.$http.get(this.$api.MENULIST, { pid: 0 }).then((res) => {
        if (res.code == 200) {
          this.topmenu = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
 
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>