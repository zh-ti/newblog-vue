<template>
  <div>
    <el-row style="margin: 10px 0">
      <TableOperations
        :searchTypes="searchTypes"
        @search="search"
        @clickAdd="showAddForm"
        @clickDelete="deleteUsers(selected.map(item => item.id))"
        @clickReset="loadPageData"
      ></TableOperations>
      <el-table
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        :header-row-style="{ backgroundColor: '#eee', color: '#555' }"
        :header-cell-style="{ backgroundColor: 'transparent' }"
        v-loading="loading"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          prop="username"
          label="账号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="avatar" label="头像"></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="130px"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-col :span="12">
              <el-button
                type="primary"
                size="mini"
                :data="scope"
                @click="showEditForm(scope.row)"
              >
                修改
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-popconfirm
                title="确定删除吗？此操作不可撤回！"
                @confirm="deleteUser(scope.row)"
              >
                <el-button slot="reference" type="warning" size="mini">
                  删除
                </el-button>
              </el-popconfirm>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="page.total"
        :page-size="page.size"
        :current-page="page.current"
        @current-change="changePage"
        @prev-click="prevOrNextPage"
        @next-click="prevOrNextPage"
      ></el-pagination>
    </el-row>
    <el-dialog
      :visible.sync="showEdit"
      title="修改用户信息"
      align="center"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form inline v-model="form" class="manage-user-form">
        <el-form-item label="账号">
          <el-input
            type="text"
            v-model="form.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" placeholder="请选择头像"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            type="text"
            v-model="form.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            type="text"
            v-model="form.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            type="textarea"
            v-model="form.address"
            placeholder="请输入地址信息"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="center">
          <el-button
            v-if="operation == 'add'"
            type="success"
            plain
            @click="addUser"
          >
            添加
          </el-button>
          <el-button
            v-if="operation == 'update'"
            type="warning"
            plain
            @click="updateUserInfo"
          >
            修改
          </el-button>
          <el-button type="primary" plain @click="showEdit = false">
            关闭
          </el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableOperations from '@/components/table/TableOperations'

import {
  getUserListApi,
  addUserApi,
  updateUserApi,
  deleteUsersApi,
} from '@/api/userApi'

export default {
  components: {
    TableOperations,
  },
  data() {
    return {
      tableData: [],
      page: {
        current: 1,
        size: 8,
        total: 0,
      },
      selected: [],
      searchTypes: [
        {
          label: '账号',
          value: 'username',
        },
        {
          label: '邮箱',
          value: 'email',
        },
        {
          label: '手机',
          value: 'phone',
        },
        {
          label: '地址',
          value: 'address',
        },
      ],
      operation: 'update',
      showEdit: false,
      form: {
        username: '',
        avatar: '',
        email: '',
        phone: '',
        address: '',
      },
      loading: true,
    }
  },
  created() {
    this.loadPageData()
  },
  methods: {
    // 搜索方法
    search({ searchType, searchContent }) {
      if (searchType && searchContent) {
        this.loadPageData(1, this.page.size, {
          [searchType]: searchContent,
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择并输入搜索内容',
        })
      }
    },
    // 显示添加表单
    showAddForm() {
      this.operation = 'add'
      this.resetForm()
      this.showEdit = true
    },
    // 添加编辑表单
    showEditForm(row) {
      this.form.id = row.id
      this.form.username = row.username
      this.form.avatar = row.avatar
      this.form.email = row.email
      this.form.phone = row.phone
      this.form.address = row.address
      this.operation = 'update'
      this.showEdit = true
    },
    addUser() {
      addUserApi(this.form).then(res => {
        if (res.success && res.data > 0) {
          this.$message({
            type: 'success',
            message: '添加用户成功',
          })
          this.showEdit = false
          this.loadPageData()
        } else {
          this.$message({
            type: 'warning',
            message: res.message,
          })
        }
      })
    },
    updateUserInfo() {
      updateUserApi(this.form).then(res => {
        if (res.success && res.data > 0) {
          this.$message({
            type: 'success',
            message: '用户信息修改成功',
          })
          this.loadPageData()
          this.showEdit = false
          this.resetForm()
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          })
        }
      })
    },
    deleteUser({ id }) {
      this.realDeleteUsers([id])
    },
    deleteUsers(ids) {
      if (ids.length > 0) {
        this.$confirm('确定删除吗？此操作不可撤回，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.realDeleteUsers(ids)
          })
          .catch(() => {})
      }
    },
    realDeleteUsers(ids) {
      deleteUsersApi(ids).then(res => {
        if (res.success && res.data > 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
          this.loadPageData()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败',
          })
        }
      })
    },
    handleSelectionChange(selected) {
      this.selected = selected
    },
    // 当点击了分页插件中的上一页或下一页按钮时修改 page 对象
    prevOrNextPage(page) {
      this.loadPageData(page)
    },
    // 当点击了分页插件中的按钮时修改 page 对象
    changePage(page) {
      this.loadPageData(page)
    },
    // 加载数据
    loadPageData(page = this.page.current, size = this.page.size, condition) {
      this.loading = true
      getUserListApi(page, size, condition).then(res => {
        if (res.success) {
          let data = res.data
          this.tableData = data.dataList
          this.page.current = data.currentPage
          this.page.size = data.pageSize
          this.page.total = data.total
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          })
        }
        this.loading = false
      })
    },
    resetForm() {
      this.form = {
        username: '',
        avatar: '',
        email: '',
        phone: '',
        address: '',
      }
    },
  },
}
</script>

<style scoped>
.manage-user-form >>> .el-popconfirm__main {
  margin: 5px 0;
}
.manage-user-form >>> .el-form-item {
  width: 100%;
}
.manage-user-form >>> .el-form-item:last-child {
  margin-bottom: 0;
}
.manage-user-form >>> .el-form-item__label {
  width: 70px;
  letter-spacing: 0.25em;
}
.manage-user-form >>> .el-form-item__content {
  width: calc(100% - 100px);
}
</style>
