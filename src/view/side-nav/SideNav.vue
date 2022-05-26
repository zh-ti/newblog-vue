<template>
  <el-aside :width="showWidth + 'px'" style="height: 100vh">
    <el-menu
      :default-openeds="['1', '3']"
      style="overflow-x: hidden; height: 100%"
      background-color="rgb(48, 65, 86)"
      text-color="#fff"
      active-text-color="#ffd046"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <div
        style="
          height: 60px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <img src="@/assets/logo.png" width="20" alt="" />
        <b style="margin-left: 5px; color: #fff" v-show="!isCollapse">
          后台管理系统
        </b>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-message"></i>
          <span slot="title">系统管理</span>
        </template>
        <el-menu-item index="1-1" @click="$router.push('/admin/user')">
          用户管理
        </el-menu-item>
        <el-menu-item index="1-2" @click="$router.push('/admin/demo')">
          demo
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">文章管理</span>
        </template>
        <el-menu-item index="2-1" @click="$router.push('/article/edit')">
          文章编辑
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">导航三</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="3-1">选项1</el-menu-item>
          <el-menu-item index="3-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="3-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="3-4">
          <template slot="title">选项4</template>
          <el-menu-item index="3-4-1">选项4-1</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      showWidth: this.width,
    }
  },
  watch: {
    isCollapse: {
      immediate: true,
      handler(value) {
        this.showWidth = value ? 64 : this.width
      },
    },
  },
}
</script>

<style></style>
