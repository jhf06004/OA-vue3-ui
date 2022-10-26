<!-- 页面路由信息 -->
<template>
  <div>
    <section>
      <transition name="fade-transform" mode="out-in">
        <!--        <router-view v-slot="{Component }">-->
        <!--          <keep-alive>-->
        <!--            <component is="Component"></component>-->
        <!--          </keep-alive>-->
        <!--        </router-view>-->
        <router-view :key="key"/>
      </transition>
    </section>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const key = computed(() => {
  return route.path
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
