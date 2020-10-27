<template>
  <el-table
    :data="menulist"
    style="width: 100%"
    row-key="id"
    border
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column label="名称" width="180" prop="title"> </el-table-column>
    <el-table-column label="图标" width="180">
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="180">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type == 1" size="small">目录</el-tag>
        <el-tag type="success" v-else-if="scope.row.type == 2" size="small"
          >菜单</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column label="菜单URL" width="180" prop="url"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="$emit('edit',scope.row)"
          >编辑</el-button
        >
        <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
          >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    menulist: {
      type: Array,
      required: true,
    },
  },
  methods: {
    //点击删除按钮的操作
    handleDelete(id) {
      this.$confirm("此操作将删除该菜单项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.post(this.$api.MENUDELETE, { id }).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$emit("changeMenu",res.list);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
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
  },
};
</script>
<style lang="less">
.el-button{margin-top:0}
</style>