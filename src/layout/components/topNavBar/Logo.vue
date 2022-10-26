<!-- 顶部导航栏中的logo以及项目名称 -->
<template>
  <div>
    <div class="logo-container">
      <img :src="companyLogo" alt="">
      <span class="title">
        {{ defaultSettings.title }}
      </span>
    </div>
  </div>
</template>

<script setup>
import defaultSettings from '@/settings.js'
import companyLogo from '@/assets/images/companylogo.png'
</script>

<style scoped lang="scss">
.logo-container{
  display: flex;
  align-items: center;
  .title{
    font-size: 24px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 32px;
    letter-spacing: 2px;
  }
  img{
    height: 40px;
    margin-right: 16px;
    filter: brightness(100);
  }
}
</style>
