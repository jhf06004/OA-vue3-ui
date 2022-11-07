<template>
  <el-select v-model="dictCode" :clearable="clearable" :placeholder="placeholder" :style="{'width': props.width + 'px'}"
             @change="handleChange">
    <el-option v-for="(item,index) in options" :key="index" :label="item.dictLabel" :value="item.dictCode"/>
  </el-select>
</template>

<script setup>
import {onMounted, watch, ref} from "vue";
import {getDictData} from "@/utils/dict.js";

const emit = defineEmits(["update:dictCode"])
const props = defineProps({
  // 字典类型
  dictType: {
    type: String,
    default: '',
    required: true
  },
  // 是否可清除
  clearable: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  width: {
    type: [String, Number],
    default: 220
  },
  // 选中的值
  dictCode: {
    type: [String, Number],
    default: ''
  }
})
const options = ref([])
// 监听dictCode的变化
const dictCode = ref({})
watch(() => {
  return props.dictCode
}, (newVal) => {
  dictCode.value = newVal
}, {immediate: true})

function handleChange(value) {
  emit('update:dictCode', value)
}

/* 根据字典类型获取字典数据 */
onMounted(async () => {
  options.value = await getDictData(props.dictType)
})
</script>

<style scoped>

</style>
