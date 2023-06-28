<template>
  <div>
    <div style="margin: 10px 0"><!--padding填充，控制搜索框在main窗口的位置-->
      <el-input style="width: 200px" placeholder="请输入名字" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 200px;margin-left: 5px" placeholder="请输入邮箱" suffix-icon="el-icon-message"
                v-model="email"></el-input>
      <el-input style="width: 200px;margin-left: 5px" placeholder="请输入地址" suffix-icon="el-icon-position"
                v-model="address"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="selectAllUsers">搜索</el-button>
      <el-button style="margin-left: 5px" type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus"></i></el-button>
      <el-popconfirm
          style="margin-left: 5px"
          confirm-button-text='确定'
          cancel-button-text='不用了'
          icon="el-icon-info"
          icon-color="red"
          title="你确定全部删除吗？"
          @confirm="deleteBatch"
      >
        <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove"></i></el-button>
      </el-popconfirm>

      <el-upload :action="'http://'+serverIp+':8090/user/import'" :show-file-list="false" accept="xlsx"
                 :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button Style="margin-left: 5px" type="primary">导入 <i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button Style="margin-left: 5px" type="primary" @click="exp">导出 <i class="el-icon-top"></i></el-button>
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="username" label="姓名" width="140">
      </el-table-column>
      <el-table-column prop="nickname" label="称呼" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <!-- eslint-disable-next-line -->
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='确定'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="你确定删除吗？"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>
    </div>

    <el-dialog title="用户信息" :visible.sync="dialogTableVisible" width="30%">
      <el-form :model="form" label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="save" v-if="actionType == '新增'">添 加</el-button>
        <el-button type="primary" @click="edit" v-if="actionType == '修改'">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {serverIp} from "../../public/config";

export default {
  name: "User",
  data() {
    return {
      serverIp: serverIp,
      tableData: [],
      totalCount: 100,
      currentPage: 1,
      pageNum: 1,
      pageSize: 5,

      //后端user类的属性
      username: '',
      email: '',
      address: '',

      form: {
        username: '',
        nickname: '',
        email: '',
        address: '',
      },
      //也可以写成form:{}
      dialogTableVisible: false,
      multipleSelection: [],
      actionType: ''
    }
  },
  created() {
    this.selectAllUsers()
  },
  methods: {

    selectAllUsers() {
      this.request({
        method: "get",
        //url:"http://localhost:8091/user/pageUser?pageNum="+this.pageNum+"&pageSize="+this.pageSize
        url: "/user/getPageUser",
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          email: this.email,
          address: this.address
        }
      }).then(res => {
        this.tableData = res.records;//mybatis--plus返回的数据里  列表数据用records表示
        this.totalCount = res.total;
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.selectAllUsers()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.selectAllUsers()
    },
    reset() {
      this.username = ''
      this.email = ''
      this.address = ''
      this.selectAllUsers()
      this.$message({
        type: 'info',
        message: '此功能已经实现'
      })
    },
    handleAdd() {
      this.form = {}
      this.actionType = '新增'
      this.dialogTableVisible = true
    },
    save() {
      this.request({
        method: "post",
        //url:"http://localhost/8091/user/pageUser?pageNum="+this.pageNum+"&pageSize="+this.pageSize
        url: "http://'+serverIP +':8091/user/addUser",//不写http://localhst:9090是可以的，以为request.js里定义了baseUrl
        data: this.form
      }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '成功添加'
          })
          this.dialogTableVisible = false
          this.selectAllUsers()//刷新
        } else {
          this.$message({
            type: 'error',
            message: '添加失败！'
          })
        }
      })
    },
    handleEdit(row) {
      this.form = row
      this.actionType = "修改"
      this.dialogTableVisible = true
    },
    edit() {
      this.request({
        method: "put",
        //url:"http://localhos/8091/user/pageUser?pageNum="+this.pageNum+"&pageSize="+this.pageSize
        url: "http://"+serverIp+":8091/user/updateUser",
        data: this.form
      }).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '成功修改'

          })
          this.dialogTableVisible = false
          this.selectAllUsers()//刷新
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        }
      })
    },
    handleDelete(id) {
      this.request({
            method: "delete",
            //url:"http://localhost:9090/user/pageUser?pageNum="+this.pageNum+"&pageSize="+this.pageSize
            url: "http://"+serverIp+":8091/user/"+ id,
          }
      ).then(res => {
        if (res == 1) {
          this.$message({
            type: 'success',
            message: '成功修改'
          })
          this.selectAllUsers()//重新加载
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    deleteBatch() {
      let ids = this.multipleSelection.map(value => value.id)//[{},{}...]=>[1,2...]把一个对象数组变成一个id数组
      this.request({
        method: "delete",
        url: "/user/deleteBatch",
        data: ids//注意不要用data：{ids},这样会变成一个{ids:[11,12]}这种对象传给服务器，而直接写data：ids,传给服务器的是[11,12]。
        //服务器那边需要的是List<Integer>
      }).then(res => {
        if (res) {
          this.$message.success("删除成功")
          this.selectAllUsers()//重新加载，，不然删除后页面不更新
        } else {
          this.$message("删除失败")
        }
      })
    },
    handleCancel() {
      this.dialogTableVisible = false
      //为了处理，点击编辑按钮，在页面上修改了表格数据后而没有点下修改按钮，点击了取消按钮后，出现与原数据不一致的情况。
      this.selectAllUsers()//重新加载
    },
    exp() {//导出数据
      window.open("http://"+serverIp+":8091/user/export")
    },
    handleExcelImportSuccess() {//导入xlsxs数据表成功后
      this.$message.success("导入成功")
      this.selectAllUsers()
    }

  }
}
</script>

<style>
.headerBg {
  background: #eee !important;
}
</style>