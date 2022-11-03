<template>
  <div class="page-container">
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="字典名称">
        <el-input
            v-model="queryParams.dictName"
            class="search-item"
            clearable
            placeholder="请输入字典名称"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" :clearable="true" class="search-item" placeholder="字典状态">
          <el-option v-for="(item,key) in dictStatus" :key="key" :label="item.label" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="btn-line">
      <el-col :span="1.5">
        <el-button
            :icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
    </el-row>
    <vxe-table
        ref="dictTableRef"
        :data="tableInfo.dictList"
        :header-cell-style="{ background: '#fafafa' }"
        :loading="tableInfo.loading"
        border="inner"
        stripe>
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="dictName" min-width="120" title="字典名称"></vxe-column>
      <vxe-column min-width="120" title="字典类型">
        <template #default="{row}">
          <span style="color: #0d84ff;cursor: pointer">{{ row.dictType }}</span>
          <!--          <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">-->
          <!--            <span>{{ scope.row.dictType }}</span>-->
          <!--          </router-link>-->
        </template>
      </vxe-column>
      <vxe-column field="status" min-width="120" title="字典状态">
        <template #default="{row}">
          <el-tag :type="dictStatus[row.status].type">
            {{ dictStatus[row.status].label }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column field="createdTime" min-width="160" title="创建时间"></vxe-column>
      <vxe-column fixed="right" min-width="240" title="操作">
        <template #default="{row}">
          <el-button
              :icon="Edit"
              link
              type='primary'
              @click="handleUpdate(row)"
          >修改
          </el-button>
          <el-button
              :icon="Delete"
              link
              type='primary'
              @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 分页组件   -->
    <div class="pagination-box">
      <Pagination
          v-if="tableInfo.total>0"
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNum"
          :total="tableInfo.total"
          @pagination="fetchData"
      />
    </div>
    <!-- 添加或修改字典对话框 -->
    <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body draggable width="480px">
      <el-form ref="dictFormRef" :model="form" :rules="formInfo.rules" label-width="100px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formInfo.saveLoading" type="primary" @click="handleSubmitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {Search, Refresh, Delete, Edit, Plus} from '@element-plus/icons-vue'
import {listType, getType, delType, addType, updateType, refreshCache} from "@/api/system/dict/type";
import Pagination from '@/components/Pagination/index.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {addPost, delPost, getPost, listPost, updatePost} from "@/api/system/post.js";
// 查修参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
// 表格信息
const tableInfo = reactive({
  dictList: [],
  loading: false,
  total: 0
})

// 字典状态
const dictStatus = {
  '1': {label: '停用', type: 'danger'},
  '0': {label: '正常', type: 'success'},
}
// 弹窗信息
const formInfo = reactive({
  formTitle: '',
  formVisible: false,
  // 保存时的加载
  saveLoading: false,
  // 表单校验
  rules: {}
})
// 表单信息
let form = ref({})

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listType(queryParams.value).then(res => {
    console.log(res)
    tableInfo.dictList = res.rows
    tableInfo.total = res.total
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
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
  }
  handleQuery();
}

/* 修改 */
function handleUpdate(row) {
  reset()
  formInfo.formTitle = '修改字典'
  formInfo.formVisible = true
  getType(row.dictId).then(res => {
    form.value = res.data
  })
}

/* 添加 */
function handleAdd(row) {
  reset()
  formInfo.formTitle = '新增字典'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认删除名称为"' + row.postName + '"的字典', '提示', {type: 'warning',}).then(() => {
    return delPost(row.dictId);
  }).then(() => {
    fetchData()
    ElMessage.success("删除成功");
  }).catch(() => {
  })
}

/* 弹窗保存提交 */
const dictFormRef = ref(null)

function handleSubmitForm() {
  dictFormRef.value.validate(valid => {
    if (valid) {
      formInfo.saveLoading = true
      if (form.value.dictId !== undefined) {
        updateType(form.value).then(() => {
          ElMessage.success("修改成功")
          formInfo.formVisible = false
          fetchData()
        }).finally(() => {
          formInfo.saveLoading = false
        })
      } else {
        addType(form.value).then(() => {
          ElMessage.success("新增成功")
          formInfo.formVisible = false;
          fetchData();
        }).finally(() => {
          formInfo.saveLoading = false
        })
      }
    }
  })
}

/* 弹窗取消 */
function handleCancel() {
  formInfo.formVisible = false
}

// 表单重置
function reset() {
  form.value = {
    status: '0',
    postSort: 1
  };
  // this.resetForm("form");
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>

</style>
