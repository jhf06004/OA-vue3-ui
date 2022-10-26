<template>
  <div>
    <el-icon :size="20">
      <component :is="isCollapse  ? Fold : Expand" @click="toggleIsCollapse(isCollapse)"></component>
    </el-icon>
  </div>
</template>

<script setup>
import {Expand,Fold} from "@element-plus/icons";
import {useAppStore} from "@/store/app.js";
import {computed, ref} from "vue";
// 获取和设置全局状态中的侧边栏状态
const appStore = useAppStore()
let isCollapse =computed(()=>{
  return appStore.getCollapseStatus
})
// 点击切换-将存入状态管理中
function toggleIsCollapse(isOpen){
  appStore.toggleSideBarHide(!isOpen)
}
</script>

<style scoped>

</style>
