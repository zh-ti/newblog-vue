<template>
  <div>
    <Editor
      ref="editor"
      :article="article"
      :tags="tags"
      :categorys="categorys"
      :autoSaveTimeout="5000"
      @save="commitSave"
      @searchTag="searchTag"
      @publish="commitPublish"
      @withdraw="withdraw"
      v-loading="loading"
    ></Editor>
  </div>
</template>

<script>
import Editor from '@/components/article/Editor'
import { getTagListApi, addTagApi } from '@/api/tagApi'
import { getCategoryListApi } from '@/api/categoryApi'
import {
  getArticleByIdApi,
  addArticleApi,
  updateArticleApi,
  publishArticleApi,
} from '@/api/articleApi'

export default {
  components: {
    Editor,
  },
  data() {
    return {
      article: {
        id: null,
        title: '',
        summary: '',
        text: '',
        author: '',
        type: 0,
        state: 0,
        originUrl: '',
        category: '0',
        tags: [],
      },
      originArticle: {
        id: null,
        title: '',
        summary: '',
        text: '',
        author: '',
        type: 0,
        state: 0,
        originUrl: '',
        category: '0',
        tags: [],
      },
      categorys: [],
      tags: [],
      loading: false,
      doPublish: false,
    }
  },
  created() {
    let id = this.$route.params.id
    if (id) {
      this.loading = true
      this.getArticleById(id)
    }
    this.loadTags()
    this.loadCategory()
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.editor.save(null, false)
    this.article = this.originArticle
    next()
  },
  methods: {
    getArticleById(id) {
      getArticleByIdApi(id).then(res => {
        this.loading = false
        const article = res.data.dataList[0]
        if (article.text == null) article.text = ''
        if (article.html == null) article.html = ''
        if (article.tags == null) article.tags = []
        article.category = article.category.id
        this.article = article
      })
    },
    addTag() {
      let value = this.inputValue
      if (value.length > 0) {
        addTagApi(value).then(res => {
          if (res.success) {
            this.loadTags()
            this.inputValue = ''
          }
        })
      }
    },
    searchTag(value) {
      if (value.length == 0) {
        this.loadTags()
      } else {
        this.loadTags(value)
      }
    },
    loadTags(keyword = null) {
      getTagListApi(keyword).then(res => {
        this.tags = res.data
      })
    },
    loadCategory() {
      getCategoryListApi().then(res => {
        this.categorys = res.data
      })
    },
    commitSave(article) {
      if (article.title.length == 0) {
        this.$message({
          type: 'warning',
          message: '文章标题不能为空',
        })
        return
      }
      this.article = article
      this.article.author = this.$store.state.currentUser.id
      if (this.article.id == null) {
        this.save()
      } else {
        this.update()
      }
    },
    save() {
      addArticleApi(this.article).then(res => {
        this.article.id = res.data
        this.replay(res, 'save')
      })
    },
    update() {
      updateArticleApi(this.article).then(res => {
        this.replay(res, 'update')
      })
    },
    commitPublish() {
      this.$refs.editor.article.state = 1
      this.$refs.editor.save()
    },
    publish(id) {
      publishArticleApi(id).then(res => {
        this.replay(res, 'publish')
      })
    },
    withdraw() {
      this.$refs.editor.article.state = 0
      this.$refs.editor.save()
    },
    replay(res, method) {
      let message
      if (method == 'save' || message == 'update') {
        message = '文章保存成功'
      } else if (method == 'publish') {
        message = '文章发布成功'
      } else if (method == 'withdraw') {
        message = '文章撤回成功'
      }
      if (res.success) {
        this.$message({
          type: 'success',
          message: message,
        })
      } else {
        this.$message({
          type: 'warning',
          message: res.message,
        })
      }
    },
  },
}
</script>

<style></style>
