<!-- 导航栏以及侧边栏父级菜单  -->
<template>
  <div style="display: flex;align-items: center">
    <svg-icon v-if="props.icon" :icon-class="props.icon" color="#fff" style="margin-right: 10px"></svg-icon>
    <span slot="title" v-show="!isCollapse">{{ props.title }}</span>
  </div>
</template>
<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
const props = defineProps({
  icon:{
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isCollapse:{
    type:[Boolean,String],
    default: false
  }
})
</script>

<style scoped lang="scss">
</style>
