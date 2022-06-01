<template>
  <div>
    <el-row style="margin: 10px 0" class="">
      <TableOperations
        :searchTypes="searchTypes"
        @search="search"
        @clickAdd="$router.replace('/article/edit')"
        @clickDelete="deleteArticles(selected.map(item => item.id))"
        @clickReset="loadPageData"
      ></TableOperations>
      <el-table
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        header-row-class-name="table-head"
        :header-row-style="{ backgroundColor: '#eee', color: '#555' }"
        :header-cell-style="{ backgroundColor: 'transparent' }"
        v-loading="loading"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="文章标题：">
                {{ props.row.title }}
              </el-form-item>
              <el-form-item label="文章作者：">
                {{ props.row.author.username }}
              </el-form-item>
              <el-form-item label="原文地址：" v-if="props.row.type == 1">
                <el-link :src="props.row.originUrl" :underline="false">
                  {{ props.row.originUrl }}
                </el-link>
              </el-form-item>
              <el-form-item label="文章标签：">
                <el-tag
                  v-for="item in props.row.tags"
                  :key="item.id"
                  type="small"
                >
                  {{ item.name }}
                </el-tag>
              </el-form-item>
              <el-form-item label="文章摘要：">
                {{ props.row.summary }}
              </el-form-item>
              <el-form-item label="点赞数量：">
                {{ props.row.great }}
              </el-form-item>
              <el-form-item label="浏览数量：">
                {{ props.row.view }}
              </el-form-item>
              <el-form-item label="评论数量：">
                {{ props.row.comment }}
              </el-form-item>
              <el-form-item label="创建时间：">
                {{ props.row.createTime }}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          min-width="100px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="author" label="作者">
          <template slot-scope="scope">
            {{ scope.row.author.username }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类">
          <template slot-scope="scope">
            {{ scope.row.category.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="tags" label="标签">
          <template slot-scope="scope">
            <div v-for="item in scope.row.tags" :key="item.id">
              {{ item.name }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="type" label="类型" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0">
              {{ scope.row.type | typeFilter }}
            </el-tag>
            <el-tag v-else-if="scope.row.type == 1" type="warning">
              {{ scope.row.type | typeFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column porp="state" label="状态">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.state == 0"
              type="primary"
              :underline="false"
            >
              未发布
            </el-link>
            <el-link v-else-if="scope.row.state == 1" type="warning">
              已发布
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="摘要"
          prop="summary"
          min-width="100px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-col :span="12">
              <el-button
                type="primary"
                size="mini"
                :data="scope"
                @click="editArticle(scope.row)"
              >
                编辑
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-popconfirm
                title="确定删除吗？此操作不可撤回！"
                @confirm="deleteArticle(scope.row)"
                v-if="scope.row.state == 0"
              >
                <el-button slot="reference" type="danger" size="mini">
                  删除
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                title="确定撤回这篇文章吗？"
                @confirm="withdraw(scope.row)"
                v-else
              >
                <el-button slot="reference" type="warning" size="mini">
                  撤回
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
  </div>
</template>

<script>
import TableOperations from '@/components/table/TableOperations'

import {
  getArticleListApi,
  deleteArticleApi,
  withdrawArticleApi,
} from '@/api/articleApi'

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
          label: '作者',
          value: 'author',
        },
        {
          label: '标题',
          value: 'title',
        },
        {
          label: '类型',
          value: 'category',
        },
        {
          label: '标签',
          value: 'tag',
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
  filters: {
    typeFilter(type) {
      switch (type) {
        case 0:
          return '原创'
        case 1:
          return '转载'
      }
    },
    stateFiler(state) {
      switch (state) {
        case 0:
          return '未发布'
        case 1:
          return '已发布'
      }
    },
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
    editArticle(row) {
      this.$router.push({ name: 'edit', params: { id: row.id } })
    },
    deleteArticle({ id }) {
      this.realDeleteArticles([id])
    },
    deleteArticles(ids) {
      if (ids.length > 0) {
        this.$confirm('确定删除吗？此操作不可撤回，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.realDeleteArticles(ids)
          })
          .catch(() => {})
      }
    },
    realDeleteArticles(ids) {
      deleteArticleApi(ids).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
          this.loadPageData()
        } else {
          this.$message({
            type: 'error',
            message: res.message,
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
      getArticleListApi(page, size, condition).then(res => {
        this.loading = false
        let data = res.data
        this.tableData = data.dataList
        this.page.current = data.currentPage
        this.page.size = data.pageSize
        this.page.total = data.total
      })
    },
    withdraw({ id }) {
      withdrawArticleApi(id).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '文章撤回成功',
          })
          this.loadPageData()
        } else {
          this.$message({
            type: 'success',
            message: res.message,
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.table-expand >>> .el-form-item__label {
  width: 80px;
  padding-right: 0px;
  letter-spacing: 1px;
}
.table-expand {
  padding-left: 110px;
}
.table-expand >>> .el-form-item {
  margin: 0;
  line-height: 30px;
}
.table-expand >>> .el-form-item__label,
.table-expand >>> .el-form-item__content {
  line-height: 30px;
}
.table-expand .el-tag {
  margin-right: 7px;
}
</style>
