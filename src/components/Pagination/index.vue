<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :background="background"
        :layout="layout"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :total="total"
        v-bind="$attrs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['pagination', 'update:limit', 'update:page'])
let currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
let pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

/* 每页条数 */
function handleSizeChange(val) {
  if (currentPage * val > props.total) {
    currentPage = 1
  }
  emit('pagination', {page: currentPage, limit: val})
}

/* 当前页数 */
function handleCurrentChange(val) {
  emit('pagination', {page: val, limit: pageSize})
}
</script>

<style scoped>
.pagination-container {
  /*background: #fff;*/
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
