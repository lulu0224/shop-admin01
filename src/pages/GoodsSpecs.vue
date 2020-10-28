<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
    <!-- --------表格---------- -->
    <el-table :data="specslist" style="width: 100%" row-key="id" border>
      <el-table-column label="属性名称" width="180" prop="specsname">
      </el-table-column>
      <el-table-column label="属性值" width="180"> 
           <template slot-scope="scope">
               <el-tag v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
           </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
         <template slot-scope="scope">
          <el-tag type="success" size="small" effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" size="small" effect="dark" v-else >禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)"
            >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 遮罩层 -->
   <el-dialog title="规格添加" :visible.sync="dialogFormVisible" @close="reset">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="属性名称"
          :label-width="formLabelWidth"
          prop="specsname"
        >
         <el-input v-model="form.specsname" ></el-input>
        </el-form-item>
           <el-form-item label="属性值" :label-width="formLabelWidth">
          <div v-for="(item,index) in attrsArr" :key="index">
            <el-input v-model="item.value" :style="{width:'60%'}"></el-input>
            <el-button type="primary" v-if="index==0" @click="addAttr">新增属性值</el-button>
            <el-button v-else @click="delAttr(index)" type="danger">删除</el-button>
          </div>
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
      specslist: [],
      attrsArr:[{value:""}],
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        specsname:"",
        attrs: "",
        status: true,
      },
      rules: {
        specsname: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    //新增属性值
    addAttr(){
      this.attrsArr.push({value:""})
    },
    delAttr(i){
      this.attrsArr.splice(i,1)
    },
    //重置表单
    reset(){
      this.attrsArr=[{value:""}],
      this.form = {
        specsname:"",
        attrs: "",
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
        this.$http.post(this.$api.SPECSDELETE,{id}).then((res)=>{
          if (res.code == 200) {
              this.$message.success("删除成功");
              this.getspecsList();
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
      this.form.status = this.form.status ? 1:2;
      this.form.attrs = this.attrsArr.map(item=>item.value).join(",");
       let url = this.form.id? this.$api.SPECSEDIT:this.$api.SPECSADD;
       let str = this.$qs.stringify(this.form)
      this.$refs[formName].validate((valid)=>{
          if(!valid){
            return false;
          }
         this.$http.post(url,str).then(res=>{
           if(res.code == 200){
             this.$message.success("操作成功");
             this.getspecsList();
             this.dialogFormVisible = false
           }else{
             this.$message.error(res.msg)
           }
         })
      })
      
    },
    //获取一条信息
   async editinfo(id){
      let res = await this.$http.get(this.$api.SPECSINFO,{id});
      console.log(res);
           if(res.code == 200){
             this.form = {...res.list[0]};
             this.attrsArr = res.list[0].attrs.map(item=>({value:item}))
             this.form.status = res.list[0].status == 1 ?true:false;
           }else{
             this.$message.error(res.msg)
           }
    },
    //获取所有规格数据
    async getspecsList() {
      let res = await this.$http.get(this.$api.SPECSLIST);
      console.log(res);
      if (res.code == 200) {
        this.specslist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  mounted() {
    this.getspecsList();
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