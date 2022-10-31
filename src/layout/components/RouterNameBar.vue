<template>
  <div class="router-name-bar">
    {{ routerName }}
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRouter} from 'vue-router';

const router = useRouter()
const routerName = ref('')
watch(() => router.currentRoute.value, (newValue, oldValue) => {
  routerName.value = newValue?.meta?.title
}, {immediate: true})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.router-name-bar {
  height: $topRouterNameBarHeight;
  color: #222;
  font-size: 16px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background: #FFFFFF;
}
</style>
