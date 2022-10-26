<!-- 顶部导航栏布局 -->
<template>
  <div class="top-nav-container">
    <div style="display: flex;align-items: center;flex-shrink:0">
      <logo/>
      <NavMenu class="nav-menu"/>
    </div>
    <div>
      <NavRight/>
    </div>
  </div>
</template>

<script setup>
import Logo from "@/layout/components/topNavBar/Logo.vue";
import NavMenu from "@/layout/components/topNavBar/NavMenu.vue";
import NavRight from "@/layout/components/topNavBar/NavRight.vue";

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.top-nav-container{
  min-width: 750px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 0 18px;
  height: $topBarHeight;
  color: #fff;
  background: linear-gradient(90deg, #096FE7 0%, #0057BD 100%);
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
}
.nav-menu{
  margin-left: 106px;
}
</style>
