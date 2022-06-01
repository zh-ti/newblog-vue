<template>
  <div class="editor">
    <el-card shadow="hidden">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input
            style="font-size: 16px"
            v-model="article.title"
            placeholder="请输入文章标题"
            size="medium"
          ></el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="success" size="medium" @click="save">
            保存草稿
          </el-button>
          <el-button
            v-if="article.state == 0"
            type="primary"
            size="medium"
            @click="show = true"
          >
            发布文章
          </el-button>
          <el-button v-else type="warning" @click="withdraw">
            撤回文章
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <mavon-editor
          ref="mavon"
          v-model="article.text"
          boxShadowStyle="0 0 1px #999"
          codeStyle="atom-one-dark"
          :scrollStyle="true"
          :style="{ height: fullWindow ? 'unset' : 'calc(100vh - 190px)' }"
          @save="save"
          @fullScreen="fullWindow = !fullWindow"
        ></mavon-editor>
      </el-row>
    </el-card>

    <el-dialog
      :visible.sync="show"
      title="文章发布"
      top="5%"
      width="600px"
      center
    >
      <el-form label-position="left" label-width="80px" size="small">
        <el-form-item label="文章标题">
          <el-input v-model="article.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select
            v-model="article.category"
            filterable
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-tag
            :key="tag.id"
            v-for="tag in article.tags"
            closable
            :disable-transitions="true"
            @close="removeTag(tag)"
            style="margin: 0 7px 7px 0"
            class="tag"
          >
            {{ tag.name }}
          </el-tag>
          <el-popover width="305" placement="right" trigger="click">
            <el-row style="margin-bottom: 10px">
              <el-input
                size="small"
                v-model.trim="tagValue"
                placeholder="输入文字搜索，输入完成按 Enter 新增标签"
                @input="searchTag(tagValue)"
                @keyup.enter.native="addTag"
              ></el-input>
            </el-row>
            <el-row>
              <el-tag
                :key="tag.id"
                v-for="tag in tags"
                :disable-transitions="true"
                style="margin: 0 7px 7px 0; cursor: pointer"
                :type="
                  article.tags.find(item => item.id == tag.id)
                    ? 'primary'
                    : 'info'
                "
                @click.self="selectTag(tag)"
                size="medium"
              >
                {{ tag.name }}
              </el-tag>
            </el-row>
            <el-button slot="reference" size="small">添加标签</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-radio-group v-model.number="article.type" size="medium">
            <el-radio :label="0">原创</el-radio>
            <el-radio :label="1">转载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转载地址">
          <el-input
            :disabled="article.type == 0"
            type="text"
            placeholder="请输入原文的地址"
            v-model="article.originUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input
            style="line-height: 20px"
            type="textarea"
            v-model="article.summary"
            placeholder="请输入文章摘要"
            :rows="4"
            maxlength="100"
            resize="none"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" plain @click="publish">发布</el-button>
          <el-button type="primary" @click="show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => ({
        id: null,
        title: '',
        summary: '',
        text: '',
        author: '',
        type: 0,
        originUrl: '',
        category: '',
        tags: [],
      }),
    },
    categorys: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    autoSaveTimeout: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fullWindow: false,
      tagValue: '',
      inputTagFlag: null,
      autoSaveFlag: null,
      show: false,
      editCount: -1,
    }
  },
  mounted() {
    if (this.saveInterval > 0) {
      this.autoSave()
    }
  },
  watch: {
    // 检测文章是否被修改过，默认为 -1 因为加载文章时会产生一次修改不用计数
    article: {
      deep: true,
      handler() {
        this.editCount++
        this.autoSave()
      },
    },
  },
  methods: {
    removeTag(tag) {
      let index = this.article.tags.findIndex(item => item.id == tag.id)
      if (index != -1) {
        this.article.tags.splice(index, 1)
      }
    },
    selectTag(tag) {
      if (!this.article.tags.find(item => item.id == tag.id)) {
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
    searchTag(value) {
      this.inputTagFlag && clearTimeout(this.inputTagFlag)
      this.inputTagFlag = setTimeout(() => this.$emit('searchTag', value), 300)
    },
    save(e = null) {
      // 如果 e != null 说明为手动点击按钮保存，所以忽略所有条件必须保存
      if (
        e != null ||
        (this.editCount > 0 &&
          // 如果 title 和 text 的长度都为 0 则不需要进行自动保存
          (this.article.title.length > 0 || this.article.text.length > 0))
      ) {
        const { d_render, d_value } = this.$refs.mavon.$data
        this.article.text = d_value
        this.article.html = d_render
        this.$emit('save', this.article)
        this.editCount = -1
      }
    },
    autoSave() {
      if (this.autoSaveTimeout > 0) {
        this.autoSaveFlag && clearTimeout(this.autoSaveFlag)
        this.autoSaveFlag = setTimeout(() => this.save(), this.autoSaveTimeout)
      }
    },
    publish() {
      this.$emit('publish')
      this.show = false
    },
    withdraw() {
      this.$confirm('确定要撤回文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => this.$emit('withdraw'))
        .catch(e => e)
    },
  },
}
</script>

<style scoped>
.editor {
  position: relative;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
}
.editor >>> pre {
  padding: 0;
}
.editor >>> .hljs {
  padding: 5px 10px;
  border-radius: 3px;
  line-height: 18px;
}
</style>
