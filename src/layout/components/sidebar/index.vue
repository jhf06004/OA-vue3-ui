<!-- 侧边栏 -->
<template>
  <div>
    <div class="sidebar-main-container" v-show="hiddenSidebar">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
            :default-active="activeMenu"
            :collapse="appStore.getCollapseStatus"
            :unique-opened="true"
            :collapse-transition="false"
            mode="vertical"
            router
        >
          <sidebar-item :routes="routes"/>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  侧边栏展开收缩icon  -->
    <div class="collapse-icon">
      <collapse-icon/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {usePermissionStore} from "@/store/permission.js";
import SidebarItem from "@/layout/components/sidebar/SidebarItem.vue";
import {useAppStore} from "@/store/app.js";
import CollapseIcon from "@/layout/components/sidebar/CollapseIcon.vue";

const route = useRoute()

// menu组件默认跳转的路径
const activeMenu = computed(() => {
  const {path, meta} = route
  if (meta && meta.activeMenu) {
    return meta.activeMenu
  }

  return path.replace(/^\//g, '')
})
// 状态管理中的路由
const userRouterStore = usePermissionStore()
const {routes: routesList, addRoutes, currentRoutes} = storeToRefs(userRouterStore)
const routes = computed(() => {
  // 获取子集目录
  return currentRoutes.value
})

// 获取和设置全局状态中的侧边栏状态
const appStore = useAppStore()
const hiddenSidebar = computed(() => {
  return appStore.getSidebarHidden
})
</script>

<style scoped lang="scss">
:deep(.el-menu) {
  border: none;
}

.scrollbar-wrapper {
  overflow-x: hidden !important;
}

.collapse-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  left: 20px;
  bottom: -20px;
}
</style>
