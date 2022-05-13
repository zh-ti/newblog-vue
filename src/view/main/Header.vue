<template>
  <el-header
    style="
      text-align: right;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
    "
  >
    <slot name="left"></slot>
    <slot name="center"></slot>
    <slot name="right"></slot>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  
}
</script>

<style></style>
