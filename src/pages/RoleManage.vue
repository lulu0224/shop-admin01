<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary"   @click="dialogFormVisible = true" >添加</el-button>
    <!-- --------表格---------- -->
    <el-table :data="roleslist" style="width: 100%" row-key="id" border>
      <el-table-column label="名称" width="180" prop="rolename">
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag type="success" size="small" effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" size="small" effect="dark" v-else >禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" 
                    type="danger" 
                    @click="delFn(scope.row.id)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 遮罩层 -->
    <el-dialog title="角色添加" :visible.sync="dialogFormVisible" @open="getmenuList" @close="reset">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="rolename"
        >
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-tree
            :data="menulist"
            show-checkbox
            node-key="id"
            ref="tree"
            check-strictly
            :props="{children:'children',label:'title'}"
            :default-checked-keys="checkedKeys"
          >
          </el-tree>
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
      checkedKeys:[],
      menulist:[],
      roleslist: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        rolename: "",
        menus: [],
        status: true,
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //重置表单
    reset(){
      this.form = {
        rolename: "",
        menus: [],
        status: true,
      }
    },
    //点击删除按钮
    delFn(id){
      this.$confirm("此操作将删除该角色项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post(this.$api.ROLEDELETE,{id}).then((res)=>{
          if (res.code == 200) {
              this.$message.success("删除成功");
              this.getroleList();
            } else {
              this.$message.error(res.msg)
            }
        });
      }).catch(() => {
            this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
  },
    //点击编辑操作
    editFn(id){
      this.dialogFormVisible = true;
      this.editinfo(id)
    },
    //点击提交按钮
    submitForm(formName){
      this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
      this.form.status = this.form.status ? 1:2;
       let url = this.form.id? this.$api.ROLEEDIT:this.$api.ROLEADD;
       let str = this.$qs.stringify(this.form)
      this.$refs[formName].validate((valid)=>{
          if(!valid){
            return false;
          }
         this.$http.post(url,str).then(res=>{
           if(res.code == 200){
             this.$message.success("操作成功");
             this.getroleList();
             this.dialogFormVisible = false
           }else{
             this.$message.error(res.msg)
           }
         })
      })
      
    },
    //编辑的数据操作
    async editinfo(id){
      let res = await this.$http.get(this.$api.ROLEINFO,{id});
           if(res.code == 200){
             this.checkedKeys = res.list.menus.split(",");
             this.form.menus = this.checkedKeys;
             this.form.status = res.list.status == 1 ?true:false;
             this.form.rolename  = res.list.rolename;
             this.form.id = id
           }else{
             this.$message.error(res.msg)
           }
    },
    //获得角色列表数据
    async getroleList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      if (res.code == 200) {
        this.roleslist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 向后台请求菜单的所有数据
    async getmenuList() {
      let res = await this.$http.get(this.$api.MENULIST, { istree: true })
        if (res.code == 200) {
          this.menulist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
    },
  },
  mounted() {
    this.getroleList();
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>