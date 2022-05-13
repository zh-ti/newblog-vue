<template>
  <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
    <el-col :span="12" style="margin-bottom: 10px; min-width: 400px">
      <el-row :gutter="5">
        <el-col :span="20">
          <el-input
            style="width: 100%"
            placeholder="请输入搜索内容"
            v-model.trim="searchContent"
          >
            <el-select
              v-model="searchType"
              slot="prepend"
              placeholder="请选择"
              style="width: 90px"
            >
              <el-option
                v-for="(item, index) in searchTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              slot="append"
              type="primary"
              @click="search(searchType, searchContent)"
            >
              搜索
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="clickReset">重置</el-button>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12" style="margin-bottom: 10px; min-width: calc(100px * 4)">
      <el-button type="success" plain @click="clickAdd">
        新增
        <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <el-button type="danger" plain @click="clickDelete">
        删除
        <i class="el-icon-delete"></i>
      </el-button>
      <el-button type="primary" plain @click="clickImport">
        导入
        <i class="el-icon-download"></i>
      </el-button>
      <el-button type="primary" plain @click="clickExport">
        导出
        <i class="el-icon-upload2"></i>
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    searchTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchType: '',
      searchContent: '',
    }
  },
  methods: {
    search(searchType, searchContent) {
      if (searchContent.length > 0) {
        this.$emit('search', { searchType, searchContent })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择并输入搜索内容',
        })
      }
    },
    clickAdd() {
      this.$emit('clickAdd')
    },
    clickDelete() {
      this.$emit('clickDelete')
    },
    clickImport() {
      this.$emit('clickImport')
    },
    clickExport() {
      this.$emit('clickExport')
    },
    clickReset() {
      this.searchType = ''
      this.searchContent = ''
      this.$emit('clickReset')
    },
  },
}
</script>

<style></style>
