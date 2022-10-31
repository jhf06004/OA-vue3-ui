<template>
  <div class="page-container">
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input
            v-model="queryParams.postCode"
            clearable
            placeholder="请输入岗位编码"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input
            v-model="queryParams.postName"
            clearable
            placeholder="请输入岗位名称"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" :clearable="true" placeholder="岗位状态">
          <el-option v-for="(item,key) in jobStatus" :key="key" :label="item.label" :value="key"/>
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
        ref="jobTableRef"
        :header-cell-style="{ background: '#fafafa' }"
        border="inner"
        stripe
        :data="tableInfo.jobList"
        :loading="tableInfo.loading">
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="postCode" min-width="120" title="岗位编码"></vxe-column>
      <vxe-column field="postName" min-width="90" title="岗位名称"></vxe-column>
      <vxe-column field="status" min-width="120" title="岗位状态">
        <template #default="{row}">
          <el-tag :type="jobStatus[row.status].type">
            {{ jobStatus[row.status].label }}
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
    <!-- 添加或修改岗位对话框 -->
    <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body draggable width="480px">
      <el-form ref="jobFormRef" :model="form" :rules="formInfo.rules" label-width="100px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" class="form-item" placeholder="请输入岗位名称"/>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" class="form-item" placeholder="请输入编码名称"/>
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="form.postSort" :min="0" class="form-item" controls-position="right"/>
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="(item,key) in jobStatus" :key="key" :label="key">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" class="form-item" placeholder="请输入内容" type="textarea"/>
        </el-form-item>
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
import {getMenu, saveMenu, delMenu} from "@/api/system/menu.js";
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
  jobList: [],
  loading: false,
  total: 0
})

// 岗位状态
const jobStatus = {
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
  rules: {
    postName: [
      {required: true, message: "岗位名称不能为空", trigger: "blur"}
    ],
    postCode: [
      {required: true, message: "岗位编码不能为空", trigger: "blur"}
    ],
    postSort: [
      {required: true, message: "岗位顺序不能为空", trigger: "blur"}
    ]
  }
})
// 表单信息
let form = ref({})

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listPost(queryParams.value).then(res => {
    tableInfo.jobList = res.rows
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
  formInfo.formTitle = '修改岗位'
  formInfo.formVisible = true
  getPost(row.menuId).then(res => {
    form.value = res.data
  })
}

/* 添加 */
function handleAdd(row) {
  reset()
  if (row != null && row.menuId) {
    form.value.parentId = row.menuId;
  } else {
    form.value.parentId = '0';
  }
  formInfo.formTitle = '新增岗位'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认删除名称为"' + row.postName + '"的岗位', '提示', {type: 'warning',}).then(() => {
    return delPost(row.postId);
  }).then(() => {
    fetchData()
    ElMessage.success("删除成功");
  }).catch(() => {
  })
}

/* 弹窗保存提交 */
const jobFormRef = ref(null)

function handleSubmitForm() {
  jobFormRef.value.validate(valid => {
    if (valid) {
      formInfo.saveLoading = true
      if (form.value.postId !== undefined) {
        updatePost(form.value).then(() => {
          ElMessage.success("修改成功")
          formInfo.formVisible = false
          fetchData()
        }).finally(() => {
          formInfo.saveLoading = false
        })
      } else {
        addPost(form.value).then(() => {
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
    status: '0'
  };
  // this.resetForm("form");
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  float: right;
}

.form-item {
  width: 300px;
}

</style>
