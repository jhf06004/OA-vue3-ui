<template>
  <div class="page-container">
    <el-form ref="queryForm" :inline="true" :model="queryParams">
      <el-form-item label="角色名称">
        <el-input
            v-model="queryParams.roleName"
            class="search-item"
            clearable
            placeholder="请输入角色名称"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input
            v-model="queryParams.roleKey"
            class="search-item"
            clearable
            placeholder="请输入权限字符"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" :clearable="true" class="search-item" placeholder="角色状态">
          <el-option v-for="(item,key) in roleStatus" :key="key" :label="item.label" :value="key"/>
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
        ref="roleTableRef"
        :data="tableInfo.roleList"
        :header-cell-style="{ background: '#fafafa' }"
        :loading="tableInfo.loading"
        border="inner"
        stripe>
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="roleName" min-width="120" title="角色名称"></vxe-column>
      <vxe-column field="roleKey" min-width="120" title="权限字符"></vxe-column>
      <vxe-column field="roleSort" min-width="30" title="显示顺序"></vxe-column>
      <vxe-column align="center" min-width="120" title="状态">
        <template #default="{row}">
          <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(row)"
          ></el-switch>
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
    <!-- 添加或修改角色对话框 -->
    <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body destroy-on-close draggable
               width="500px">
      <el-form ref="roleFormRef" :model="form" :rules="formInfo.rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" class="form-item" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" class="form-item" placeholder="请输入权限字符"/>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" :min="0" class="form-item" controls-position="right"/>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="(item,key) in roleStatus" :key="key" :label="key">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuParams.menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠
          </el-checkbox>
          <el-checkbox v-model="menuParams.menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选
          </el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动
          </el-checkbox>
          <el-tree
              ref="menuRef"
              :check-strictly="!form.menuCheckStrictly"
              :data="menuTreeData"
              :props="defaultProps"
              class="tree-border"
              empty-text="加载中，请稍候"
              node-key="id"
              show-checkbox
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" class="form-item" placeholder="请输入备注内容" type="textarea"/>
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
import {Search, Refresh, Delete, Edit, Plus, Download} from '@element-plus/icons-vue'
import {listRole, getRole, delRole, saveRole, dataScope, changeRoleStatus, deptTreeSelect} from "@/api/system/role";
import Pagination from '@/components/Pagination/index.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {menuTreeSelect} from "@/api/system/menu.js";
// 查修参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
// 表格信息
const tableInfo = reactive({
  roleList: [],
  loading: false,
  total: 0
})
// 定义树形结构数据
const defaultProps = {
  children: "children",
  label: "label"
}
// 角色状态
const roleStatus = {
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
    roleName: [
      {required: true, message: "角色名称不能为空", trigger: "blur"}
    ],
    roleKey: [
      {required: true, message: "权限字符不能为空", trigger: "blur"}
    ],
    roleSort: [
      {required: true, message: "角色顺序不能为空", trigger: "blur"}
    ]
  }
})
// 表单信息
let form = ref({})

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listRole(queryParams.value).then(res => {
    tableInfo.roleList = res.rows
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
  formInfo.formTitle = '修改角色'
  formInfo.formVisible = true
  getRole(row.roleId).then(res => {
    form.value = res.data
  })
}

/* 添加 */
function handleAdd() {
  reset()
  getMenuTreeSelect()
  formInfo.formTitle = '新增角色'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {
  ElMessageBox.confirm('是否确认要删除该数据？', '提示', {type: 'warning'}).then(() => {
    return delRole(row.roleId);
  }).then(() => {
    fetchData()
    ElMessage.success("删除成功");
  }).catch(() => {
  })
}

/* 弹窗保存提交 */
const roleFormRef = ref(null)

function handleSubmitForm() {
  roleFormRef.value.validate(valid => {
    if (valid) {
      formInfo.saveLoading = true
      saveRole(form.value).then(() => {
        ElMessage.success("保存成功")
        formInfo.formVisible = false
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

// 角色状态修改
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？', {type: 'warning'}).then(function () {
    return changeRoleStatus(row.roleId, row.status);
  }).then(() => {
    ElMessage.success(text + "成功")
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
}

/* form表单菜单权限树形 */
const menuParams = reactive({
  menuExpand: false,
  menuNodeAll: false,
})
// 菜单权限树形数据
const menuTreeData = ref([])
const menuRef = ref({})

/** 查询菜单树结构 */
function getMenuTreeSelect() {
  menuTreeSelect().then(res => {
    menuTreeData.value = res.data;
  });
}

// 树权限（展开/折叠）
function handleCheckedTreeExpand(value, type) {
  if (type === 'menu') {
    let treeList = menuTreeData.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type === 'dept') {
    // let treeList = this.deptOptions;
    // for (let i = 0; i < treeList.length; i++) {
    //   this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
    // }
  }
}

// 树权限（全选/全不选）
function handleCheckedTreeNodeAll(value, type) {
  if (type === 'menu') {
    menuRef.value.setCheckedNodes(value ? menuTreeData.value : [])
  } else if (type === 'dept') {
    // this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
  }
}

// 树权限（父子联动）
function handleCheckedTreeConnect(value, type) {
  if (type === 'menu') {
    form.menuCheckStrictly = !!value
  } else if (type === 'dept') {
    form.deptCheckStrictly = !!value
  }
}

// 表单重置
function reset() {
  form.value = {
    status: '0',
    roleSort: 1
  };
  // this.resetForm("form");
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>

.tree-border {
  max-height: 200px;
  overflow: auto;
  margin: 10px 0;
  padding: 15px 20px;
  background: rgba(241, 242, 243, .6);
  border-radius: 5px;
  width: 100%;
}

.form-item {
  width: 300px;
}
</style>
