<template>
  <div>
    <div ref="pageContainerRef" class="page-container">
      <div class="dept-container">
        <div class="left-tree">
          <div>
            <el-input v-model="filterText" clearable placeholder="请输入部门名称关键字"/>
            <el-tree ref="deptTreeRef" :data="selectFromInfo.DeptData" :filter-node-method="filterNode"
                     :props="defaultProps"
                     @node-click="handleDeptNodeClick"/>
          </div>
        </div>
        <div class="line"></div>
        <div class="right-info">
          <el-form ref="queryForm" :inline="true" :model="queryParams">
            <el-form-item label="姓名">
              <el-input
                  v-model="queryParams.nickName"
                  class="search-item"
                  clearable
                  placeholder="请输入姓名"
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                  v-model="queryParams.phonenumber"
                  class="search-item"
                  clearable
                  placeholder="请输入手机号"
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="创建时间" prop="menuName">
              <el-date-picker
                  v-model="queryParams.time"
                  end-placeholder="结束日期"
                  range-separator="~"
                  start-placeholder="开始日期"
                  style="width: 260px"
                  type="daterange"
              />
            </el-form-item>
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="queryParams.status" :clearable="true" class="search-item" placeholder="菜单状态">
                <el-option v-for="(item,key) in userStatus" :key="key" :label="item.label" :value="key"/>
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
                  :icon="Delete"
                  plain
                  type="danger"
                  @click=""
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  :icon="Download"
                  plain
                  type="warning"
                  @click=""
              >导出
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  :icon="Upload"
                  plain
                  type="success"
                  @click=""
              >导入
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  :icon="Refresh"
                  plain
                  type="primary"
                  @click=""
              >重置密码
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  :icon="Notification"
                  plain
                  type="primary"
                  @click=""
              >分配角色
              </el-button>
            </el-col>
          </el-row>
          <vxe-table
              ref="userTableRef"
              :data="tableInfo.userList"
              :header-cell-style="{ background: '#fafafa' }"
              :loading="tableInfo.loading"
              border="inner"
              resizable
              stripe>
            <vxe-column width="20px"></vxe-column>
            <vxe-column field="nickName" min-width="120" title="姓名"></vxe-column>
            <vxe-column field="postName" min-width="90" title="工号"></vxe-column>
            <vxe-column field="phonenumber" min-width="120" title="手机号码"></vxe-column>
            <vxe-column field="emil" min-width="90" title="邮箱"></vxe-column>
            <vxe-column field="deptName" min-width="90" title="部门"></vxe-column>
            <vxe-column field="postName" min-width="90" title="岗位"></vxe-column>
            <vxe-column field="postName" min-width="90" title="职级"></vxe-column>
            <vxe-column field="status" min-width="120" title="状态">
              <template #default="{row}">
                <el-tag :type="userStatus[row.status].type">
                  {{ userStatus[row.status].label }}
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column field="roleStr" min-width="90" title="角色"></vxe-column>
            <vxe-column field="createdTime" min-width="160" title="创建时间"></vxe-column>
            <vxe-column field="partTimeDeptOne" min-width="90" title="兼任部门"></vxe-column>
            <vxe-column field="partTimePostOne" min-width="90" title="兼任岗位"></vxe-column>
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
        </div>
      </div>
    </div>
    <div>
      <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body class="user-dialog"
                 draggable width="780px">
        <el-collapse v-model="foldList" accordion>
          <el-collapse-item :name="1">
            <template #title>
              <el-icon :size="18">
                <Document/>
              </el-icon>
              <span style="font-size: 16px;margin-left: 10px">用户基本信息</span>
            </template>
            <el-form ref="userFormRef" :model="form" :rules="formInfo.rules" style="padding: 10px 40px 0">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入姓名" style="width: 220px"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态" prop="empType">
                    <el-radio-group v-model="form.status">
                      <el-radio v-for="(item,key) in userStatus" :key="key" :label="key">{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="员工类型" prop="empType">
                    <el-radio-group v-model="form.empType">
                      <el-radio v-for="(item,key) in empTypeEnum" :key="key" :label="key">{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工号" prop="userNo">
                    <el-input v-model="form.userNo" placeholder="请输入工号" style="width: 220px"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phonenumber">
                    <el-input v-model="form.phonenumber" placeholder="请输入手机号" style="width: 220px"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" style="width: 220px"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登录密码" prop="password">
                    <el-input v-model.trim="form.password" placeholder="请输入登录密码" show-password
                              style="width: 220px"
                              type="password"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色" prop="orderNum">
                    <el-input-number v-model="form.roleIds" :min="0" class="form-item" controls-position="right"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="入职时间" prop="inductionDate">
                    <el-input v-model="form.inductionDate" class="form-item" placeholder="请输入入职时间"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="部门" prop="deptId">
                    <el-tree-select v-model="form.deptId" :data="selectFromInfo.DeptData" :render-after-expand="false"
                                    placeholder="请选择部门"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="岗位" prop="postId">
                    <el-select v-model="form.postId" class="form-item" placeholder="请输入岗位">
                      <el-option
                          v-for="(item,index) in selectFromInfo.postData"
                          :key="index"
                          :label="item.postName"
                          :value="item.postId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职级" prop="deptId">
                    <el-input v-model="form.deptId" class="form-item" placeholder="请输入部门"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" :rows="3" autosize placeholder="请输入备注" style="width: 90%"
                              type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="formInfo.saveLoading" type="primary" @click="handleSubmitForm">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch, ref} from "vue";
import {listDept, treeSelect} from "@/api/system/dept.js";
import {Search, Refresh, Delete, Edit, Plus, Document, Download, Upload, Notification} from '@element-plus/icons-vue'
import {getUser, listUser} from "@/api/system/user.js";
import Pagination from "@/components/Pagination/index.vue"
import {handleTree} from "@/utils/index.js";
import {listPost} from "@/api/system/post.js";
import {getDictData} from "@/utils/dict/index.js";
import {useDictStore} from "@/store/dict.js";
// 请求字典数据
getDictData(['post_level', 'official_type'])
const dictStore = useDictStore()
const dicData = dictStore.getDictData
console.log(dicData['official_type'])
const defaultProps = {
  children: 'children',
  label: 'label',
}
// 下拉框中的数据
const selectFromInfo = reactive({
  DeptData: [],
  postData: []
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

/* 获取部门的树形结构 */
function getDeptList() {
  listDept().then(res => {
    res.data.forEach(item => {
      item.value = item.deptId
      item.label = item.deptName
    })
    selectFromInfo.DeptData = handleTree(res.data, "deptId")
  })
}

/* 获取岗位下拉数据 */
function getPostList() {
  listPost().then(res => {
    selectFromInfo.postData = res.rows
  })
}

/* 左侧树形结构 */
function handleDeptNodeClick(deptNode) {
  console.log(deptNode.id)
  queryParams.value.deptId = deptNode.id
  // filterText.value = deptNode.label
  fetchData()
}


/* 搜索以及表格 */
// 查修参数
const userStatus = {
  '1': {label: '停用', type: 'danger'},
  '0': {label: '正常', type: 'success'},
}
const empTypeEnum = {
  '1': {label: '正式员工', type: 'danger'},
  '2': {label: '实习生', type: 'success'},
}
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
// 表格信息
const tableInfo = reactive({
  userList: [],
  total: 0,
  // 表格加载动画
  loading: false
})
// 弹窗信息
const formInfo = reactive({
  formVisible: false,
  formTitle: '新增用户',
  saveLoading: false,
  rules: {}
})
const form = ref({})
// 折叠面板--展开值
const foldList = ref([1, 2])

/* 获取列表数据 */
function fetchData() {
  tableInfo.loading = true
  listUser(queryParams.value).then(res => {
    tableInfo.userList = res.rows
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
    pageSize: 10
  }
  handleQuery();
}

// 表单重置
function reset() {
  form.value = {
    status: '0',
    empType: '1',
  };
  // this.resetForm("form");
}

/* 新增 */
function handleAdd() {
  reset()
  formInfo.formVisible = true
  formInfo.formTitle = '添加用户'
  // console.log('11',dictRequest('post_level'))
  // getUser().then(res => {
  //   selectFromInfo.postData = res.posts;
  //   // this.roleOptions = response.roles;
  //   // form.value.password = this.initPassword;
  // });
}

/* 修改 */
function handleUpdate() {
  reset()
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete(row) {

}

/* 保存 */
function handleSubmitForm() {
  formInfo.formVisible = false
}

/* 取消 */
function handleCancel() {
  formInfo.formVisible = false
}

onMounted(() => {
  fetchData()
  getDeptList()
  getPostList()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

$pageContainerPadding: 20px;
.page-container {
  padding: 0 !important;
}

.dept-container {
  display: flex;

  .left-tree {
    padding: $pageContainerPadding;
    display: flex;
    min-width: 240px;
  }

  .line {
    margin: 0 10px 0 0;
    border-left: 1px solid #eee;
    // 计算方式 ： 100vh - 顶部导航高度 - 当前路由名称栏的高度 - 上下外边距
    min-height: calc(100vh - $topBarHeight - $topRouterNameBarHeight - ($pageContainerPadding * 2))
  }

  .right-info {
    padding: $pageContainerPadding;
    overflow: auto;
  }
}

:deep(.el-tree) {
  margin-top: 18px;
}

</style>
<style lang="scss">
.user-dialog .el-dialog__body {
  padding-top: 10px !important;
}
</style>
