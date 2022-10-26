<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter.native="handleQuery"
            class="form-item"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable="true" class="form-item">
            <el-option label="开启" :value="0"/>
            <el-option label="关闭" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="btn-line">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            :icon="Plus"
            @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            :icon="SortUp"
            @click="$refs.menuTableRef.setAllTreeExpand(true)"
        >展开</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            :icon="SortDown"
            @click="$refs.menuTableRef.clearTreeExpand()"
        >折叠</el-button>
      </el-col>
    </el-row>
    <vxe-table
        ref="menuTableRef"
        :loading="tableInfo.loading"
        max-height="400"
        :tree-config="{transform: true, rowField: 'menuId', parentField: 'parentId'}"
        :data="tableInfo.menuList">
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="menuName" title="菜单名称" tree-node min-width="120"></vxe-column>
      <vxe-column field="orderNum" title="排序" min-width="120"></vxe-column>
      <vxe-column field="component" title="组件路径" min-width="120">
        <template #default="{row}">
          <span>{{ row.component || '-' }}</span>
        </template>
      </vxe-column>
      <vxe-column field="status" title="状态" min-width="120"></vxe-column>
      <vxe-column field="createdTime" title="创建时间" min-width="120"></vxe-column>
      <vxe-column title="操作" min-width="240" fixed="right">
        <template #default="{row}">
          <el-button
              :icon="Edit"
              type="text"
              @click="handleUpdate(row)"
          >修改
          </el-button>
          <el-button
              type="text"
              :icon="Plus"
              @click="handleAdd(row)"
          >新增
          </el-button>
          <el-button
              type="text"
              :icon="Delete"
              @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="formInfo.formTitle" v-model="formInfo.formVisible" width="680px" append-to-body>

    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref} from "vue";
import {listMenu} from "@/api/system/menu.js";
import {SortDown,SortUp,Search, Refresh, Delete, Edit, Plus, Sort} from '@element-plus/icons-vue'

onMounted(() => {
  fetchData()
})
// 查修参数
const queryParams = ref({})
// 表格信息
const tableInfo = reactive({
  menuList: [],
  loading: false
})
// 弹窗信息
const formInfo = reactive({
  formTitle: '',
  formVisible: false,
  rules: {}
})
const form = ref({})
/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listMenu(queryParams).then(res => {
    tableInfo.menuList = res.data
  }).finally(() => {
    tableInfo.loading = false
  })
}

/* 搜索按钮操作 */
function handleQuery() {
  fetchData()
}

/** 重置按钮操作 */
function resetQuery() {
  // this.resetForm("queryForm");
  handleQuery();
}
/* 修改 */
function handleUpdate() {
  formInfo.formTitle = '修改菜单'
  formInfo.formVisible = true
}
/* 添加 */
function handleAdd() {
  formInfo.formTitle = '新增菜单'
  formInfo.formVisible = true
}
/* 删除 */
function handleDelete() {
}
</script>

<style scoped>

</style>
