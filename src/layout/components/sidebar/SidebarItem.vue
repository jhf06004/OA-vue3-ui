<template>
  <template v-for="(item,index) in props.routes" :key="index">
    <template v-if="!item.hidden">
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.parentPath">
        <template #title>
          <Item :title="item.meta.title" :icon="item.meta.icon" :is-collapse="useAppStore().getCollapseStatus"></Item>
        </template>
        <!-- 递归遍历自己 -->
        <sidebar-item :routes="item.children"></sidebar-item>
      </el-sub-menu>
      <el-menu-item v-else :index="item.parentPath">
        <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" color="#fff"
                  style="margin-right: 10px;"></svg-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup>
import Item from './Item.vue'
import {useAppStore} from "@/store/app.js";
import {onMounted} from "vue";

const props = defineProps({
  // 路由菜单
  routes: {
    type: Array,
    required: true
  }
})
// onMounted(()=>{
//   console.log(props.routes)
// })
</script>
