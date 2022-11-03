<template>
  <div>
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="字典名称">
        <el-select v-model="queryParams.dictType">
          <el-option
              v-for="item in dictTypeList"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" :clearable="true" class="search-item" placeholder="字典数据状态">
          <el-option v-for="(item,key) in dictDataStatus" :key="key" :label="item.label" :value="key"/>
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
            :icon="Back"
            plain
            type="warning"
            @click="handleClose"
        >返回
        </el-button>
      </el-col>
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
      <vxe-column width="20"/>
      <vxe-column field="dictLabel" min-width="120" title="字典标签">
        <template #default="{row}">
          <!--          <span v-if="!row.listClass || row.listClass === 'default'">{{row.dictLabel}}</span>-->
          <el-tag :type="row.listClass === 'primary' ? '' : row.listClass">{{ row.dictLabel }}</el-tag>
        </template>
      </vxe-column>
      <vxe-column field="dictValue" min-width="120" title="字典键值"></vxe-column>
      <vxe-column field="dictSort" min-width="120" title="字典排序"></vxe-column>
      <vxe-column field="status" min-width="120" title="状态">
        <template #default="{row}">
          <el-tag :type="dictDataStatus[row.status].type">
            {{ dictDataStatus[row.status].label }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column min-width="200" show-overflow title="备注">
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
      <el-form ref="dictDataFormRef" :model="form" :rules="formInfo.rules" label-width="100px">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true" class="form-item"/>
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" class="form-item" placeholder="请输入数据标签"/>
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" class="form-item" placeholder="请输入数据键值"/>
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="form.cssClass" class="form-item" placeholder="请输入样式属性"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" :min="0" class="form-item" controls-position="right"/>
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="form.listClass" class="form-item">
            <el-option
                v-for="item in listClassOptions"
                :key="item.value"
                :label="item.label + '(' + item.value + ')'"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="(item,key) in dictDataStatus" :key="key" :label="key">{{ item.label }}</el-radio>
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
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search, Refresh, Delete, Edit, Plus, Download, Back} from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination/index.vue'
import {addData, delData, getData, listData, updateData} from "@/api/system/dict/data.js";
import {optionSelect as getDictOptionSelect} from "@/api/system/dict/type";

const props = defineProps({
  dictType: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:dictType', 'update:visible'])
// 显示字典类型或字典数据页面--双向绑定
const visible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})

// 显示字典页面
function handleClose() {
  visible.value = true
}

// 查修参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  // 字典类型
  dictType: props.dictType
})
// 表格信息
const tableInfo = reactive({
  dictList: [],
  loading: false,
  total: 0
})

// 字典数据状态
const dictDataStatus = {
  '1': {label: '停用', type: 'danger'},
  '0': {label: '正常', type: 'success'},
}
// 数据标签回显样式
const listClassOptions = [
  {
    value: "default",
    label: "默认"
  },
  {
    value: "primary",
    label: "主要"
  },
  {
    value: "success",
    label: "成功"
  },
  {
    value: "info",
    label: "信息"
  },
  {
    value: "warning",
    label: "警告"
  },
  {
    value: "danger",
    label: "危险"
  }
]
// 弹窗信息
const formInfo = reactive({
  formTitle: '',
  formVisible: false,
  // 保存时的加载
  saveLoading: false,
  // 表单校验
  rules: {
    dictLabel: [
      {required: true, message: "数据标签不能为空", trigger: "blur"}
    ],
    dictValue: [
      {required: true, message: "数据键值不能为空", trigger: "blur"}
    ],
    dictSort: [
      {required: true, message: "数据顺序不能为空", trigger: "blur"}
    ]
  }
})
// 表单信息
let form = ref({})
console.log('form', form.value)

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listData(queryParams.value).then(res => {
    tableInfo.dictList = res.rows
    tableInfo.total = res.total
  }).finally(() => {
    tableInfo.loading = false
  })
}

/* 获取字典类型下拉-查询字典类型列表 */
const dictTypeList = ref([])

function getDictTypeList() {
  getDictOptionSelect().then(res => {
    dictTypeList.value = res.data
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
  getData(row.dictCode).then(res => {
    form.value = res.data
  })
}

/* 添加 */
function handleAdd() {
  reset()
  formInfo.formTitle = '新增字典'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认要删除该数据?', '提示', {type: 'warning',}).then(() => {
    return delData(row.dictCode);
  }).then(() => {
    fetchData()
    ElMessage.success("删除成功");
  }).catch(() => {
  })
}

/* 弹窗保存提交 */
const dictDataFormRef = ref(null)

function handleSubmitForm() {
  dictDataFormRef.value.validate(valid => {
    if (valid) {
      formInfo.saveLoading = true
      if (form.value.dictCode) {
        updateData(form.value).then(() => {
          ElMessage.success("修改成功")
          formInfo.formVisible = false
          fetchData()
        }).finally(() => {
          formInfo.saveLoading = false
        })
      } else {
        addData(form.value).then(() => {
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
    dictType: props.dictType,
    dictSort: 0,
    listClass: 'default',
    status: '0'
  }
}

onMounted(() => {
  fetchData()
  getDictTypeList()
})
</script>

<style scoped>
.form-item {
  width: 300px;
}
</style>
