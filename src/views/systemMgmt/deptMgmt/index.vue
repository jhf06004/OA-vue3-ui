<template>
  <div class="page-container">
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="部门名称">
        <el-input
            v-model="queryParams.deptName"
            class="search-item"
            clearable
            placeholder="请输入部门名称"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" :clearable="true" class="search-item" placeholder="部门状态">
          <el-option v-for="(item,key) in deptStatus" :key="key" :label="item.label" :value="key"/>
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
      <el-col :span="1.5">
        <el-button
            :icon="SortUp"
            plain
            type="info"
            @click="$refs.deptTableRef.setAllTreeExpand(true)"
        >展开
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            :icon="SortDown"
            plain
            type="info"
            @click="$refs.deptTableRef.clearTreeExpand()"
        >折叠
        </el-button>
      </el-col>
    </el-row>
    <vxe-table
        ref="deptTableRef"
        :header-cell-style="{ background: '#fafafa' }"
        border="inner"
        stripe
        :data="tableInfo.deptList"
        :loading="tableInfo.loading"
        :tree-config="{transform: true, expandAll: true, rowField: 'deptId', parentField: 'parentId'}">
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="deptName" min-width="160" title="部门名称" tree-node></vxe-column>
      <vxe-column field="orderNum" min-width="90" title="排序"></vxe-column>
      <vxe-column field="status" min-width="120" title="状态">
        <template #default="{row}">
          <el-tag :type="deptStatus[row.status].type">
            {{ deptStatus[row.status].label }}
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
              :icon="Plus"
              link
              type='primary'
              @click="handleAdd(row)"
          >新增
          </el-button>
          <el-button
              v-if="row.parentId !== '0'"
              :icon="Delete"
              link
              type='primary'
              @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body draggable width="780px">
      <el-form ref="deptFormRef" :model="form" :rules="formInfo.rules" label-width="100px" style="padding: 0 40px">
        <el-row>
          <el-col v-if="form.parentId !== 0" :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                  v-model="form.parentId"
                  :check-strictly="true"
                  :data="deptOptions"
                  :render-after-expand="false"
                  placeholder="选择上级部门"
              ></el-tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" class="form-item" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" :min="0" class="form-item" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" class="form-item" maxlength="20" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" class="form-item" maxlength="11" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" class="form-item" maxlength="50" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status" class="form-item">
                <el-radio v-for="(item,key) in deptStatus" :key="key" :label="key">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
import {SortDown, SortUp, Search, Refresh, Delete, Edit, Plus, Sort, QuestionFilled} from '@element-plus/icons-vue'
import {handleTree} from "@/utils/index.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {delDept, getDept, listDept, saveDept} from "@/api/system/dept.js";
// 查修参数
const queryParams = ref({})
// 部门状态
const deptStatus = {
  '1': {label: '停用', type: 'danger'},
  '0': {label: '正常', type: 'success'},
}
// 表格信息
const tableInfo = reactive({
  deptList: [],
  loading: false
})
// 弹窗信息
const formInfo = reactive({
  formTitle: '',
  formVisible: false,
  // 保存时的加载
  saveLoading: false,
  rules: {
    parentId: [
      {required: true, message: "上级部门不能为空", trigger: "blur"}
    ],
    deptName: [
      {required: true, message: "部门名称不能为空", trigger: "blur"}
    ],
    orderNum: [
      {required: true, message: "显示排序不能为空", trigger: "blur"}
    ],
    email: [
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"]
      }
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ]
  }
})
// 表单信息
let form = ref({})

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listDept(queryParams.value).then(res => {
    tableInfo.deptList = res.data
    getTreeSelect()
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
  queryParams.value = {}
  handleQuery()
}

/* 修改 */
function handleUpdate(row) {
  reset()
  getDept(row.deptId).then(res => {
    form.value = res.data
    formInfo.formTitle = '修改部门'
    formInfo.formVisible = true
  })
}

/* 获取弹窗中的树形 */

/* 添加 */
function handleAdd(row) {
  reset()
  if (row && row.deptId) {
    form.value.parentId = row.deptId;
  } else {
    form.value.parentId = ''
  }
  formInfo.formTitle = '新增部门'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认删除名称为"' + row.deptName + '"的部门', '提示', {type: 'warning',}).then(() => {
    return delDept(row.deptId)
  }).then(() => {
    fetchData()
    ElMessage.success("删除成功")
  }).catch(() => {
  })
}

/* 弹窗保存提交 */
const deptFormRef = ref(null)

function handleSubmitForm() {
  deptFormRef.value.validate(valid => {
    if (valid) {
      formInfo.saveLoading = true
      saveDept(form.value).then(() => {
        ElMessage.success("操作成功")
        formInfo.formVisible = false;
        fetchData()
      }).finally(() => {
        formInfo.saveLoading = false
      })
    }
  })
}

/* 弹窗取消 */
function handleCancel() {
  formInfo.formVisible = false
}

/** 查询部门下拉树结构 */
const deptOptions = ref([])

function getTreeSelect() {
  listDept().then(res => {
    deptOptions.value = [];
    // 添加默认选择
    res.data.forEach(item => {
      item.value = item.deptId
      item.label = item.deptName
    })
    deptOptions.value = handleTree(res.data, "deptId");
    // deptOptions.value.unshift({value: '0', label: '-', deptId: '0', deptName: '-', children: []})
  });
}

// 表单重置
function reset() {
  form.value = {
    status: '0',
    orderNum: 1
  }
  // this.resetForm("form");
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>

//
//.form-item {
//  width: 220px;
//}

//.form-item-label {
//  margin-right: 10px;
//}
//

</style>
