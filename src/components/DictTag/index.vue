<template>
  <el-tag :type="tagType">标签二</el-tag>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getDictData} from "@/utils/dict.js";

const props = {
  dictType: {
    type: String,
    default: ''
  },
  dictCode: {
    type: [String, Number],
    default: ''
  }
}
/* 根据字典类型获取字典数据 */
const tagType = ref('')
onMounted(async () => {
  options.value = await getDictData(props.dictType)
  // 遍历查找tag的类型
  options.value.length && options.value.forEach(item => {
    if (item.dictCode === props.dictCode) {
      tagType.value = item.listClass
    }
  })
})
</script>

<style scoped>

</style>
