<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- --------表格---------- -->
    <el-table :data="memberlist" style="width: 100%" row-key="id" border>
      <el-table-column label="昵称" width="180" prop="nickname"></el-table-column>
      <el-table-column label="手机号" width="180" prop="phone"> </el-table-column>
      <el-table-column label="注册时间" width="180" prop="addtime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background 
               layout="prev, pager, next" 
               :total="pageinfo.total"
               :page-size="pageinfo.size"
               @current-change="pageChange"
               :current-page="pageinfo.page"
     >
    </el-pagination>
    <!-- 遮罩层 -->
   <el-dialog title="管理员添加" :visible.sync="dialogFormVisible" @open = "getroleList" @close="reset">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="角色"
          :label-width="formLabelWidth"
          prop="roleid"
        >
          <el-select v-model="form.roleid" placeholder="请选择角色">
            <el-option
              :label="item.rolename"
              :value="item.id"
              v-for="item in roleslist"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
           <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" ></el-input>
        </el-form-item>
           <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="form.password" type="password"></el-input>
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
      memberlist: [],
      roleslist:[],
      dialogFormVisible: false,
      formLabelWidth: "100px",
      pageinfo:{
           size:2,
           page:1,
           total:0,
      },
      form: {
        uid:"",
        nickname: "",
        phone:"",
        password:"",
        status: true,
      },
      rules: {
        roleid: [{ required: true, message: "请选择角色", trigger: "change" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
    };
  },
  methods: {
    pageChange(page){
      this.pageinfo.page = page;
      this.getmemberList();
    },
    //重置表单
    reset(){
      this.form = {
        roleid: "",
        username:"",
        password:"",
        status: true,
      }
    },
    //点击编辑操作
    editFn(uid){
      this.dialogFormVisible = true;
      this.editinfo(uid)
    },
   /*  //点击提交按钮
    submitForm(){
      this.form.status = this.form.status ? 1:2;
       let str = this.$qs.stringify(this.form)
         this.$http.post(this.$api.MEMBEREDIT,str).then(res=>{
           console.log(res);
           if(res.code == 200){
             this.$message.success("操作成功");
             this.getmemberList();
             this.dialogFormVisible = false
           }else{
             this.$message.error(res.msg)
           }
         })
      
    }, */
    //获取一条信息
   async editinfo(uid){
      let res = await this.$http.get(this.$api.MEMBERINFO,{uid});
      console.log(res);
           if(res.code == 200){
             this.form = {...res.list}
             this.form.status = res.list.status == 1 ?true:false;
           }else{
             this.$message.error(res.msg)
           }
    },
    //获取所有user数据
    async getmemberList() {
      this.getpage()
      let page = this.pageinfo.page;
      let size = this.pageinfo.size
      let res = await this.$http.get(this.$api.MEMBERLIST,{size,page});
      console.log(res);
      if (res.code == 200) {
        this.memberlist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取管理员总数
    async getpage() {
      let res = await this.$http.get(this.$api.MEMBERCOUNT);
      if (res.code == 200) {
          this.pageinfo.total = res.list[0].total;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取角色名称
    async getroleList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      if (res.code == 200) {
        this.roleslist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  mounted() {
    this.getmemberList();
    this.getpage();
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-pagination{
     text-align: right;
     margin-top: 10px;
}
</style>