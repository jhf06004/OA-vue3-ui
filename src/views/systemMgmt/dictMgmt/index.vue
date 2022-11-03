<template>
  <div class="page-container">
    <div v-if="dictPage.visible">
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
        <!--      <el-col :span="1.5">-->
        <!--        <el-button-->
        <!--            type="warning"-->
        <!--            plain-->
        <!--            :icon="Download"-->
        <!--            @click="handleExport"-->
        <!--        >导出</el-button>-->
        <!--      </el-col>-->
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
            <span style="color: #0d84ff;cursor: pointer" @click="toDictData(row)">{{ row.dictType }}</span>
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
        <vxe-column min-width="160" show-overflow title="备注">
          <template #default="{row}">
            <span>{{ row.remark || '-' }}</span>
          </template>
        </vxe-column>
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
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" class="form-item" placeholder="请输入字典名称"/>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="form.dictType" class="form-item" placeholder="请输入字典类型"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="(item,key) in dictStatus" :key="key" :label="key">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" class="form-item" placeholder="请输入内容" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="formInfo.saveLoading" type="primary" @click="handleSubmitForm">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-else>
      <DictData
          v-model:visible="dictPage.visible"
          :dictType="dictPage.dictType"
      />
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search, Refresh, Delete, Edit, Plus, Download} from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
import DictData from './DictData.vue'
import {listType, getType, delType, addType, updateType, refreshCache, exportDictType} from "@/api/system/dict/type";
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
  rules: {
    dictName: [
      {required: true, message: "字典名称不能为空", trigger: "blur"}
    ],
    dictType: [
      {required: true, message: "字典类型不能为空", trigger: "blur"}
    ]
  }
})
// true为显示字典类型，false显示字典数据
const dictPage = reactive({
  visible: true,
  // 选中的字典类型id--用于字典数据页面获取信息
  dictType: ''
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

/* 导出 */
// function handleExport(){
//   downloadExcel(exportDictType(), {
//     ...queryParams.value
//   }, `type_${new Date().getTime()}.xlsx`)
// }

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认删除名称为"' + row.dictName + '"的字典', '提示', {type: 'warning',}).then(() => {
    return delType(row.dictId);
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
  };
  // this.resetForm("form");
}

/* 显示字典数据 */
function toDictData(row) {
  dictPage.visible = false
  dictPage.dictType = row.dictType
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.form-item {
  width: 300px;
}
</style>
