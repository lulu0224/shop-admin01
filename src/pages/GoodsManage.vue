<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- --------表格---------- -->
    <el-table :data="goodslist" style="width: 100%" row-key="id" border>
      <el-table-column label="一级分类" width="120" prop="firstcatename"></el-table-column>
      <el-table-column label="二级分类" width="120" prop="secondcatename"> </el-table-column>
      <el-table-column label="商品名称" width="120" prop="goodsname"></el-table-column>
      <el-table-column label="销售价" width="120" prop="price"></el-table-column>
      <el-table-column label="市场价" width="120" prop="market_price">
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-tag type="success" size="small" effect="dark" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" size="small" effect="dark" v-else >禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delFn(scope.row.id)" >删除</el-button>
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
   <el-dialog title="商品添加" :visible.sync="dialogFormVisible"  @close="reset" @open="openFn">
      <el-form :model="form"  ref="form">
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
          <el-select v-model="form.second_cateid" placeholder="请选择分类">
            <el-option
              :label="item.catename"
              :value="item.id"
              v-for="item in secondCate"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>        
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.goodsname" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
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
        <el-form-item label="商品规格名" :label-width="formLabelWidth">
          <el-select v-model="form.specsid" placeholder="请选择商品规格名" @change="specsNameChange">
            <el-option
              :label="item.specsname"
              :value="item.id"
              v-for="item in specslist"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格值" :label-width="formLabelWidth">
          <el-select v-model="form.specsattr" placeholder="请选择商品规格值" multiple>
            <el-option
              :label="item"
              :value="item"
              v-for="item in specsarr"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="销售价" :label-width="formLabelWidth">
            <el-input-number v-model="form.price" controls-position="right" placeholder="请输入销售价"></el-input-number>
        </el-form-item>
         <el-form-item label="市场价" :label-width="formLabelWidth">
          <el-input-number v-model="form.market_price" controls-position="right" placeholder="请输入市场价"></el-input-number>
        </el-form-item>
         <el-form-item label="商品描述" :label-width="formLabelWidth">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item label="是否是新品" :label-width="formLabelWidth">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否是热卖" :label-width="formLabelWidth">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="form.status" :label="1">是</el-radio>
          <el-radio v-model="form.status" :label="2">否</el-radio>
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
import E from "wangeditor";
export default {
  data() {
    return {
      goodslist: [],
      specslist:[],//商品规格名列表
      specsarr:[],//商品规格值
      firstCate:[],//一级分类列表
      secondCate:[],//二级分类列表
      fileList: [],
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      preVisible: false,
      formLabelWidth: "100px",
      pageinfo:{
           size:2,
           page:1,
           total:0,
      },
      form: {
        first_cateid:"",
        second_cateid: "",
        goodsname:"",
        price:"",
        market_price:"",
        img:"",
        description:"",
        specsid:"",
        specsattr:"",
        isnew:1,
        ishot:1,
        status: 1,
      },
    };
  },
  methods: {
     fileChange(file) {
      this.form.img = file.raw;
    },
    handleRemove() {
      console.log("handleRemove");
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.preVisible = true;
    },
    pageChange(page){
      this.pageinfo.page = page;
      this.getgoodsList();
    },
    //一级分类选择发生改变，二级分类渲染的内容发生对应的改变
    fstCateChange(pid){
      this.getsecondCate(pid)
    },
    //商品规格名选择发生改变，商品规格值渲染的内容发生对应的改变
    specsNameChange(id){
      this.specsarr = this.specslist.find(item=>item.id == id).attrs;
    },
    //重置表单
    reset(){
       this.fileList =[],
      this.form = {
        first_cateid:"",
        second_cateid: "",
        goodsname:"",
        price:"",
        market_price:"",
        img:"",
        description:"",
        specsid:"",
        specsattr:"",
        isnew:1,
        ishot:1,
        status: 1,
      },
      this.editor = null;
      document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },
     // 打开对话框的回调
    openFn() {
      this.getfirstCate();
      this.getspecsList()
    },
    addFn(){
      this.dialogFormVisible = true;
      this.editor = new E("#editor");
          this.editor.config.onchange = newHtml => {
            this.form.description = newHtml;
          };
      this.editor.create();
    },
    //点击删除按钮
    delFn(id){
      this.$confirm("此操作将删除该角色项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post(this.$api.GOODSDELETE,{id}).then((res)=>{
          if (res.code == 200) {
              this.$message.success("删除成功");
              this.pageinfo.page = 1;
              this.getgoodsList();
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
      this.editinfo(id);
    },
    //点击提交按钮
    submitForm(formName){
       let url = this.form.id? this.$api.GOODSEDIT:this.$api.GOODSADD;
      this.form.specsattr = this.form.specsattr.join(",");
      console.log(this.form);
      this.$refs[formName].validate((valid)=>{
          if(!valid){
            return false;
          }
         this.$http.upload(url,this.form).then(res=>{
           if(res.code == 200){
             this.$message.success("操作成功");
             this.getgoodsList();
             this.dialogFormVisible = false
           }else{
             this.$message.error(res.msg)
           }
         })
      })
      
    },
    //获取一条信息
   async editinfo(id){
      let res = await this.$http.get(this.$api.GOODSINFO,{id});
           if(res.code == 200){
             this.form = {...res.list};
             this.form.id = id;
             this.getsecondCate(this.form.first_cateid);
             this.specsarr = this.form.specsattr.split(",");
              this.form.specsattr = this.form.specsattr.split(",")
            this.fileList = [{ name: "", url: this.$url + this.form.img }];
              this.editor = new E("#editor");
            this.editor.config.onchange = newHtml => {
            this.form.description = newHtml;
          };
            this.editor.create();
            this.editor.txt.html(this.form.description);
           }else{
             this.$message.error(res.msg)
           }
    },
    //获取所有goods数据
    async getgoodsList() {
      this.getpage();
      let page = this.pageinfo.page;
      let size = this.pageinfo.size
      let res = await this.$http.get(this.$api.GOODSLIST,{page,size});
      if (res.code == 200) {
        this.goodslist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取商品总数
    async getpage() {
      let res = await this.$http.get(this.$api.GOODSCOUNT);
      if (res.code == 200) {
          this.pageinfo.total = res.list[0].total;
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
    //获取商品规格列表
    async getspecsList(){
      let res = await this.$http.get(this.$api.SPECSLIST);
      if(res.code == 200){
        this.specslist = res.list?res.list:[];
      }else{
        this.$message.error(res.msg)
      }
    },
  },
  mounted() {
    this.getgoodsList();
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