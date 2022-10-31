<template>
  <div class="page-container">
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
    <div class="dept-container">
      <div class="left-tree">
        <el-input v-model="filterText" placeholder="请输入部门名称关键字"/>
        <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode" :props="defaultProps"
                 @node-click="handleDeptNodeClick"/>
      </div>
      <div class="right-info">
        表格
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch, ref} from "vue";
import {treeSelect} from "@/api/system/dept.js";

const defaultProps = {
  children: 'children',
  label: 'label',
}
const deptTreeInfo = reactive({
  DeptData: '',
  // 选中的部门id
  checkedDeptId: ''
})
// 输入框搜索过滤
const deptTreeRef = ref(null)
const filterText = ref('')
watch(filterText, (val) => {
  deptTreeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

// 获取部门的树形结构
function getDeptTreeData() {
  treeSelect().then(res => {
    deptTreeInfo.DeptData = res.data
  })
}

// 左侧树形结构
function handleDeptNodeClick(deptNode) {
  console.log(deptNode)
  deptTreeInfo.checkedDeptId = deptNode.id
}

onMounted(() => {
  getDeptTreeData()
})
</script>

<style scoped lang="scss">
.dept-container {
  display: flex;

  .left-tree {
    margin-right: 20px;
    width: 240px;
  }

  .right-info {
  }
}
</style>
