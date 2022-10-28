<!-- 顶部导航菜单--只有一级 -->
<template>
  <div class="nav-bar">
    <div v-for="(item,index) in routes" :key="item.path">
      <router-link :to="item.children[0].path">
        <div :class="activeIndex === index ? 'active-menu menu-item' : 'menu-item'">
          <div class="menu-info">
            <svg-icon :icon-class="(item.meta && item.meta.icon) || (item.children[0].meta.icon)" color="#fff" style="font-size: 18px"></svg-icon>
            <div style="margin-top: 2px">{{ (item.meta && item.meta.title) || (item.children[0].meta.title) }}</div>
            <div class="bottom-line" v-show="activeIndex === index"/>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {usePermissionStore} from "@/store/permission.js";
import router from "@/router/index.js";
import {useAppStore} from "@/store/app.js";
import {useRouter} from "vue-router";

const activePath = ref('')
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const routes = ref([])
const activeIndex = ref(null)
// 处理顶部导航栏的路由问题
function disposeRouter() {
  const router = useRouter()
  routes.value = permissionStore.getTopBarRouters.filter((item) => {
    if ((item.children && item.children.length > 0) || item.meta) {
      return item
    }
  })
}

// 江铜路由的改变
watch(() => router.currentRoute.value.path, (newValue) => {
  activePath.value = newValue
  disposeRouter()
  setSidebarRouter()
}, {immediate: true})

// 设置侧边栏的路由，不显示第一级
function setSidebarRouter() {
  let currentRouterChildren = []
  // TODO
  currentRouterChildren = routes?.value[0].children
  activeIndex.value = 0
  for (let i = 0; i < routes.value.length; i++) {
    console.log(routes.value[i].children)
    if (activePath.value === routes.value[i].children[0].path) {
      activeIndex.value = i
      break
    }
  }

  // 设置侧边栏的路由---只有一个隐藏侧边栏
  if (currentRouterChildren.length) {
    permissionStore.setCurrentRoutes(currentRouterChildren)
    appStore.setSidebarHidden(currentRouterChildren.length !== 1)
  }
  console.log('currentRouterChildren', currentRouterChildren)
}

</script>

<style scoped lang="scss">
$navMenuWidth: 88px;
.nav-bar{
  display: flex;
}
.active-menu {
  background: linear-gradient(180deg, rgba(0, 83, 180, 0) 0%, #0053B4 100%);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $navMenuWidth;
  height: 64px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  color: #B8D7FB;
  position: relative;
  .bottom-line{
    position: absolute;
    left: 0;
    bottom: 0;
    width: $navMenuWidth;
    height: 4px;
    background: #2287FF;
  }
}
</style>
