<template>
  <div class="app-wrapper">
    <el-container>
      <!--  顶部导航栏    -->
      <el-header class="header">
        <TopNavBar/>
      </el-header>
      <el-container>
        <!--  侧边栏  -->
        <el-aside v-show="hiddenSidebar"
                  :class="useAppStore().getCollapseStatus ? 'minWidthStyle sidebar' :'maxWidthStyle sidebar'">
          <Sidebar/>
        </el-aside>
        <!--  主题信息  -->
        <el-main class="main">
          <RouterNameBar class="router-name-bar"/>
          <div class="app-main">
            <AppMain/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import TopNavBar from "@/layout/components/topNavBar/index.vue";
import AppMain from "@/layout/components/AppMain.vue";
import Sidebar from "@/layout/components/sidebar/index.vue";
import RouterNameBar from "@/layout/components/RouterNameBar.vue";
import {useAppStore} from "@/store/app.js";
import {computed, ref} from "vue";

// 侧边栏的宽度
const appStore = useAppStore()
const hiddenSidebar = computed(() => {
  return appStore.getSidebarHidden
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: $contentHeight;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.header {
  padding: 0;
  margin: 0;
  height: $topBarHeight;
}

// 侧边栏的样式
.sidebar {
  color: #fff;
  background: $menuBg;
  height: $contentHeight;
  box-shadow: 1px 0 10px rgba(0, 0, 0, .06), 0 0 6px rgba(0, 0, 0, .02)
}

.maxWidthStyle {
  width: $sideBarWidth;
  transition: width .5s;
}

.minWidthStyle {
  width: auto;
  transition: all .5s !important;
}

.main {
  position: relative;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  height: $contentHeight;
  background: #eff3f9;
}

.router-name-bar {
  width: 100%;
  position: fixed;
  top: $topBarHeight;
  z-index: 200;
  border-bottom: 1px solid #eee;
}

.app-main {
  margin-top: $topRouterNameBarHeight;
  padding: 20px;
}

.hidden-sidebar {
  width: 0;
  transition: width .2s;
}

.show-sidebar {
  width: $sideBarWidth;
  transition: width .2s;

}
</style>
