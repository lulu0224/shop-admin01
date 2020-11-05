<template>
  <div>
    <!-- 面包屑导航 separator分割标志  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
    <!-- --------表格---------- -->
    <el-table :data="bannerlist" style="width: 100%" row-key="id" border>
      <el-table-column label="轮播图名称" width="180" prop="title">
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            effect="dark"
            v-if="scope.row.status == 1"
            >启用</el-tag>
          <el-tag type="danger" size="small" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)" >编辑</el-button >
          <el-button size="mini" type="danger" @click="delFn(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 遮罩层 -->
    <el-dialog title="轮播图添加" 
              :visible.sync="dialogFormVisible"
              @close="reset('form')"
              >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="轮播图标题"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="轮播图图片"
          :label-width="formLabelWidth"
          prop="img"
        >
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
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
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
      bannerlist: [],
      fileList: [],
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      preVisible: false,
      formLabelWidth: "120px",
      form: {
        title: "",
        img: "",
        status: true,
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图标题", trigger: "blur" },
        ],
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
    //点击删除按钮
    delFn(id) {
      this.$confirm("此操作将删除该角色项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.post(this.$api.BANNERDELETE, { id }).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getbannerList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //点击编辑操作
    editFn(id) {
      this.dialogFormVisible = true;
      this.editinfo(id);
    },
    // 点击提交按钮
    submitForm(formName) {
      let url = this.form.id ? this.$api.BANNEREDIT : this.$api.BANNERADD;
      this.form.status = this.form.status ? 1 : 2;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$http.upload(url, this.form).then((res) => {
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getbannerList();
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    //重置操作
    reset(formName) {
      this.form = {
        title: "",
        img: "",
        status: true,
      };
      this.fileList = [];
      this.$refs[formName].clearValidate()
    },
    //获取一条信息
    async editinfo(id) {
      let res = await this.$http.get(this.$api.BANNERINFO, { id });
      if (res.code == 200) {
        this.fileList = [
          {
            name: "",
            url: this.$url + res.list.img,
          },
        ];
        this.form = { ...res.list };
        this.form.id = id;
        this.form.status = res.list.status == 1 ? true : false;
        console.log(this.form);
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取所有banner数据
    async getbannerList() {
      let res = await this.$http.get(this.$api.BANNERLIST);
      if (res.code == 200) {
        this.bannerlist = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  mounted() {
    this.getbannerList();
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>