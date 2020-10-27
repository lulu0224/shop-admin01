<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
    <!-- ------表格------- -->
    <el-table
      :data="catelist"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" width="180" prop="catename">
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

    <!-- -------分类添加 ------------>
    <el-dialog
      title="分类添加"
      :visible.sync="dialogFormVisible"
      @open="gettopcateList"
      @close="reset"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="上级分类" :label-width="formLabelWidth" prop="pid">
          <el-select
            v-model="form.pid"
            placeholder="请选择上级分类"
          >
            <el-option key="0" label="顶级分类" value="0"></el-option>
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in topcate"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="catename"
        >
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" :label-width="formLabelWidth" prop="img">
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
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
      fileList:[],
      // 获取pid为0的顶级菜单的数据
      topcate: [],
      // 获取所有菜单的数据
      catelist: [],
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      preVisible:false,
      form: {
        pid: "",
        catename: "",
        img: "",
        status: true,
      },
      formLabelWidth: "100px",
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    fileChange(file){
      this.form.img = file.raw;
    },
    handleRemove() {
        console.log("handleRemove");
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.preVisible = true;
      },
      //点击删除按钮
    delFn(id){
      this.$confirm("此操作将删除该角色项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post(this.$api.CATEDELETE,{id}).then((res)=>{
          if (res.code == 200) {
              this.$message.success("删除成功");
              this.getcateList();
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
    // 点击提交按钮
    submitForm(formName) {
      let url = this.form.id ? this.$api.CATEEDIT : this.$api.CATEADD;
      this.form.status = this.form.status ? 1 : 2;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$http.upload(url,this.form).then((res)=>{
         if (res.code == 200) {
            this.$message.success("操作成功");
            this.getcateList();
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        })
      });
    },
 
    //重置操作
    reset() {
      this.form = {
        pid: "",
        catename: "",
        img: "",
        status: true,
      };
      this.fileList=[]
    },
     //获取一条信息
   async editinfo(id){
      let res = await this.$http.get(this.$api.CATEINFO,{id});
           if(res.code == 200){
              this.fileList = [{
                    name:"",
                    url:this.$url+res.list.img
              }]
             this.form = {...res.list}
              this.form.id = id;
             this.form.status = res.list.status == 1 ?true:false;
             console.log(this.form);
           }else{
             this.$message.error(res.msg)
           }
    },
    // 向后台请求菜单的所有数据
     async getcateList() {
      let res = await this.$http.get(this.$api.CATELIST, { istree: true })
        if (res.code == 200) {
          this.catelist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
    },
    // 向后台请求pid为0 的菜单数据
    async gettopcateList() {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 })
        if (res.code == 200) {
          this.topcate = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
    },
  },
  mounted() {
    this.getcateList();
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>