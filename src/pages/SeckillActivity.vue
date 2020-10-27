<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary"   @click="dialogFormVisible = true" >添加</el-button>
    <!-- --------表格---------- -->
    <el-table :data="secklist" style="width: 100%" row-key="id" border>
      <el-table-column label="活动名称" width="180" prop="title">
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
    <el-dialog title="限时秒杀添加" :visible.sync="dialogFormVisible" @open="openFn">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" :label-width="formLabelWidth">
          <el-date-picker
               v-model="value2"
               type="datetimerange"
               :picker-options="pickerOptions"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
               align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select v-model="form.first_cateid" placeholder="请选择分类" @change="fstCateChange">
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in firstCate"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="formLabelWidth">
          <el-select v-model="form.second_cateid" placeholder="请选择分类" @change="secCateChange">
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in secondCate"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid" placeholder="请选择分类">
            <el-option
              :label="item.goodsname"
              :value="item.id"
              v-for="item in goodslist"
              :key="item.id"
            ></el-option>
          </el-select>
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
      secklist: [],
      firstCate:[],//一级分类列表
      secondCate:[],//二级分类列表
      goodslist:[],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        title:"",
        bengintime:"",
        endtime:"",
        first_cateid:"",
        second_cateid:"",
        goodsid:"",
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
       openFn(){
            this.getfirstCate()
       },
        //一级分类选择发生改变，二级分类渲染的内容发生对应的改变
      fstCateChange(pid){
          this.getsecondCate(pid)
     },
     secCateChange(sid){
          this.getgoodList(sid)
     },
    //重置表单
    reset(){
      this.form = {
        title:"",
        bengintime:"",
        endtime:"",
        first_cateid:"",
        second_cateid:"",
        goodsid:"",
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
    //获得秒杀列表数据
    async getseckList() {
      let res = await this.$http.get(this.$api.SECKLIST);
      console.log(res);
      if (res.code == 200) {
        this.secklist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
      //获取一级分类
    async getfirstCate(){
      let res = await this.$http.get(this.$api.CATELIST,{pid:0});
      if(res.code == 200){
        this.firstCate = res.list?res.list:[];
      }else{
        this.$message.error(res.msg)
      }
    },
    //获取二级分类
    async getsecondCate(pid){
       let res = await this.$http.get(this.$api.CATELIST,{pid});
      if(res.code == 200){
        this.secondCate = res.list?res.list:[];
      }else{
        this.$message.error(res.msg)
      }
    },
     //获取商品
    async getgoodList(sid){
       let res = await this.$http.get(this.$api.GOODSLIST,{sid});
       console.log(res);
      if(res.code == 200){
        this.goodslist = res.list?res.list:[];
      }else{
        this.$message.error(res.msg)
      }
    },
 },
  mounted() {
    this.getseckList();
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>