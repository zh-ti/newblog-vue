<template>
  <el-container style="height: 100vh">
    <SideNav :width="200" :isCollapse="isCollapse"></SideNav>
    <el-container style="height: 100%">
      <el-header
        style="
          text-align: right;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ccc;
        "
      >
        <div style="font-size: 18px">
          <span
            :class="collapseIcon"
            style="cursor: pointer"
            @click="isCollapse = !isCollapse"
          ></span>
        </div>
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>
      <el-main style="height: calc(100% - 60px); overflow: auto">
        <el-row style="margin-bottom: 30px">
          <el-breadcrumb separator="/" style="font-size: 16px">
            <el-breadcrumb-item
              v-for="(item, index) in historyRoutes"
              :key="index"
              :to="{ path: item.path }"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
        <transition>
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from '@/view/side-nav/SideNav'

export default {
  components: {
    SideNav,
  },
  data() {
    return {
      collapseIcon: 'el-icon-s-fold',
      isCollapse: true,
      multipleSelection: [],
      historyRoutes: [],
    }
  },
  created() {},
  methods: {},
  watch: {
    isCollapse(value) {
      this.collapseIcon = value ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
    $route: {
      immediate: true,
      handler(to) {
        this.historyRoutes = to.matched.map(item => ({
          path: item.path,
          name: item.meta.name,
        }))
      },
    },
  },
}
</script>

<style>
.el-header {
  line-height: 60px;
}
</style>
