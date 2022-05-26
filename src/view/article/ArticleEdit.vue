<template>
  <div class="article-edit">
    <el-card class="operation">
      <el-row
        type="flex"
        justify="space-round"
        align="center"
        style="margin: 0"
      >
        <el-col>
          <span style="line-height: 40px">共 100 字</span>
        </el-col>
        <el-col class="buttons">
          <el-button type="success">保存草稿</el-button>
          <el-button type="primary">发布文章</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="文章标题">
          <el-input
            style="font-size: 18px"
            v-model="article.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-radio-group v-model="article.type" size="medium">
            <el-radio label="原创"></el-radio>
            <el-radio label="转载"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转载地址" v-if="article.type == '转载'">
          <el-input
            type="text"
            placeholder="请输入原文的地址"
            style=""
          ></el-input>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-tag
            :key="tag"
            v-for="tag in article.tags"
            closable
            :disable-transitions="true"
            @close="removeTag(tag)"
            style="margin: 0 7px 7px 0"
            class="tag"
          >
            {{ tag }}
          </el-tag>
          <el-popover width="305" placement="right" trigger="click">
            <el-row style="margin-bottom: 10px">
              <el-input
                v-model.trim="inputValue"
                placeholder="输入文字搜索，输入完成按 Enter 新增标签"
                size="small"
                @input="searchTag"
                @keyup.enter.native="addTag"
              ></el-input>
            </el-row>
            <el-row>
              <el-tag
                :key="tag"
                v-for="tag in tags"
                :disable-transitions="false"
                style="margin: 0 7px 7px 0; cursor: pointer"
                :type="article.tags.includes(tag) ? 'primary' : 'info'"
                @click.self="selectTag(tag)"
                @close="delTag(tag)"
                size="medium"
                closable
              >
                {{ tag }}
              </el-tag>
            </el-row>
            <el-button slot="reference" size="small">添加标签</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input
            style="font-size: 16px"
            type="textarea"
            v-model="article.summary"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入文章摘要"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <el-row style="margin-top: 20px">
        <mavon-editor
          v-model="article.content"
          boxShadowStyle="0 0 1px #999"
        ></mavon-editor>
      </el-row>
    </el-card>

    <el-backtop
      target=".main-container"
      style="z-index: 10000; background: #ecf0f1; color: #2980b9"
      :right="60"
      :bottom="40"
    ></el-backtop>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {
        title: '',
        summary: '',
        content: '',
        type: '原创',
        tags: ['js', 'java'],
      },
      tags: ['js', 'java'],
      inputValue: '',
      throttleFlag: null,
    }
  },
  mounted() {},
  methods: {
    removeTag(tag) {
      let index = this.article.tags.findIndex(item => item == tag)
      if (index != -1) {
        this.article.tags.splice(index, 1)
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    addTag() {
      if (this.inputValue) {
        if (!this.tags.includes(this.inputValue)) {
          this.tags.push(this.inputValue)
        } else {
          this.$message({
            type: 'warning',
            message: `标签“${this.inputValue}”已存在`,
          })
        }
      }
      this.inputValue = ''
    },
    delTag(tag) {
      if (this.article.tags.includes(tag)) {
        this.$message({
          type: 'warning',
          message: `标签“${tag}”已被引用无法删除`,
        })
      } else {
        let index = this.tags.findIndex(item => item == tag)
        if (index != -1) {
          this.tags.splice(index, 1)
        }
      }
    },
    selectTag(tag) {
      if (!this.article.tags.includes(tag)) {
        if (this.article.tags.length < 5) {
          this.article.tags.push(tag)
        } else {
          this.$message({
            type: 'warning',
            message: '文章最多拥有5个标签',
          })
        }
      } else {
        this.removeTag(tag)
      }
    },
    searchTag() {
      if (this.inputValue.length > 0) {
        this.throttleFlag && clearTimeout(this.throttleFlag)
        this.throttleFlag = setTimeout(() => {
          console.log(this.inputValue)
        }, 500)
      }
    },
  },
}
</script>

<style scoped>
.article-edit {
  position: relative;
}
.operation {
  position: relative;
}
.fixed-operation {
  position: fixed;
  top: 100px;
  background-color: #eee;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  /* vertical-align: bottom; */
}
</style>
