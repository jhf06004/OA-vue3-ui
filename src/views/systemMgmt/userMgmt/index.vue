<template>
  <div>
    <div class="page-container">
      <div class="dept-container">
        <div class="left-tree">
          <div>
            <el-input v-model="filterText" clearable placeholder="请输入部门名称关键字"/>
            <el-tree ref="deptTreeRef" :data="selectFromInfo.deptData" :filter-node-method="filterNode"
                     :props="defaultProps"
                     @node-click="handleDeptNodeClick"/>
          </div>
        </div>
        <div class="line"></div>
        <div class="right-info">
          <el-form ref="queryForm" :inline="true" :model="queryParams">
            <el-form-item label="姓名">
              <el-input
                  v-model="queryParams.userName"
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
                  v-model="searchDate"
                  end-placeholder="结束日期"
                  range-separator="~"
                  start-placeholder="开始日期"
                  style="width: 260px"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  @change="changeDate"
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
              >批量删除
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
                  :icon="Download"
                  plain
                  type="warning"
                  @click=""
              >导出
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
            <vxe-column field="userName" min-width="120" title="姓名"></vxe-column>
            <vxe-column field="userNo" min-width="90" title="工号"></vxe-column>
            <vxe-column field="phonenumber" min-width="120" title="手机号码"></vxe-column>
            <vxe-column field="emil" min-width="90" title="邮箱"></vxe-column>
            <vxe-column field="deptName" min-width="90" title="部门"></vxe-column>
            <vxe-column field="postName" min-width="90" title="岗位"></vxe-column>
            <vxe-column field="postId" min-width="90" title="职级"></vxe-column>
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
                <el-dropdown @command="(command) => handleCommand(command, row)">
                <span class="el-dropdown-link">
                  <el-button
                      :icon="DArrowRight"
                      link
                      type='primary'
                  >更多
                </el-button>
                </span>
                  <template #dropdown>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="handleResetPwd">重置密码</el-dropdown-item>
                      <el-dropdown-item command="handleAuthRole">分配角色</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
    <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body class="user-dialog"
               draggable width="780px">
      <el-collapse v-model="foldList">
        <!--   用户基本信息填写     -->
        <el-collapse-item :name="1">
          <template #title>
            <el-icon :size="18" style="margin-left: 24px;">
              <Document/>
            </el-icon>
            <span style="font-size: 16px;margin-left: 10px">用户基本信息</span>
          </template>
          <el-form ref="userFormRef" :model="form" :rules="formInfo.rules" label-width="80px"
                   style="padding: 10px 40px 0">
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
                  <el-select v-model="form.roleIds" :multiple="true" placeholder="请选择角色">
                    <el-option
                        v-for="item in selectFromInfo.roleData"
                        :key="item.roleId"
                        :disabled="item.status === 1"
                        :label="item.roleName"
                        :value="item.roleId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职日期" prop="inductionDate">
                  <el-date-picker
                      v-model="form.inductionDate"
                      placeholder="请选择入职日期"
                      type="date"
                      value-format="YYYY-MM-DD">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="deptId">
                  <el-tree-select v-model="form.deptId" :data="selectFromInfo.deptData" :render-after-expand="false"
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
                <el-form-item label="职级" prop="postLevel">
                  <DictSelect v-model:dictCode="form.postLevel" dictType="post_level" placeholder="请选择职级"/>
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
        <!--   选择部门和岗位     -->
        <el-collapse-item :name="2">
          <template #title>
            <el-icon :size="18" style="margin-left: 24px;">
              <Document/>
            </el-icon>
            <span style="font-size: 16px;margin-left: 10px">兼任部门岗位</span>
          </template>
          <div style="margin-left: 24px">
            <el-button
                :icon="Plus"
                plain
                style="margin: 0 0 10px 0"
                type="primary"
                @click="handleAddPart()"
            >新增
            </el-button>
            <!-- 表头  -->
            <div class="part-table">
              <ul class="head-box">
                <li class="li-column-1" style="width: 60px">序号</li>
                <li class="li-column-1">兼任部门</li>
                <li class="li-column-1">兼任岗位</li>
                <li class="li-column-1">操作</li>
              </ul>
              <ul v-for="(item,index) in form.partTimeInfo" :key="index">
                <li class="li-column-1" style="width: 60px">{{ index + 1 }}</li>
                <li class="li-column-1">
                  <el-tree-select v-model="item.deptId" :data="selectFromInfo.deptData" :render-after-expand="false"
                                  placeholder="请选择部门"/>
                </li>
                <li class="li-column-1">
                  <el-select v-model="item.postId" class="form-item" placeholder="请输入岗位">
                    <el-option
                        v-for="(item,index) in selectFromInfo.postData"
                        :key="index"
                        :label="item.postName"
                        :value="item.postId"
                    />
                  </el-select>
                </li>
                <li class="li-column-1">
                  <el-button
                      :icon="Delete"
                      link
                      type='primary'
                      @click="handleDelete(item)"
                  >删除
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formInfo.saveLoading" type="primary" @click="handleSubmitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import {onMounted, reactive, watch, ref} from "vue";
import {listDept, treeSelect} from "@/api/system/dept.js";
import {Search, Refresh, Delete, Edit, Plus, Document, Download, Upload, DArrowRight} from '@element-plus/icons-vue'
import {addUser, getUser, getUserInfo, getUserRole, listUser, resetUserPwd, updateUser} from "@/api/system/user.js";
import Pagination from "@/components/Pagination/index.vue"
import {handleTree} from "@/utils/index.js";
import {listPost} from "@/api/system/post.js";
import DictSelect from "@/components/DictSelect/index.vue"
import {listRole} from "@/api/system/role.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";

const defaultProps = {
  children: 'children',
  label: 'label',
}
// 下拉框中的数据
const selectFromInfo = reactive({
  deptData: [],
  postData: [],
  roleData: []
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
/* 搜索时间控件 */
/** 日期改变 */
const searchDate = ref([])

function changeDate() {
  if (searchDate.value?.length > 1) {
    queryParams.value.startTime = searchDate.value[0]
    queryParams.value.endTime = searchDate.value[1]
  }
  handleQuery()
}

/* 获取部门的树形结构 */
function getDeptList() {
  listDept().then(res => {
    if (res?.data?.length) {
      res.data.forEach(item => {
        item.value = item.deptId
        item.label = item.deptName
      })
      selectFromInfo.deptData = handleTree(res.data, "deptId")
    }
  })
}

/* 获取岗位下拉数据 */
function getPostList() {
  listPost().then(res => {
    selectFromInfo.postData = res.rows
  })
}

/* 获取所有角色 */
function getAllRoleList() {
  listRole().then(res => {
    selectFromInfo.roleData = res.rows
  })
}

/* 左侧树形结构 */
function handleDeptNodeClick(deptNode) {
  queryParams.value.deptId = deptNode.id
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
  rules: {
    userName: [
      {required: true, message: "用户姓名不能为空", trigger: "blur"}
    ],
    empType: [
      {required: true, message: "员工类型不能为空", trigger: "blur"}
    ],
    userNo: [
      {required: true, message: "工号不能为空", trigger: "blur"}
    ],
    phonenumber: [
      {required: true, message: "手机号码不能为空", trigger: "blur"}
    ],
    password: [
      {required: true, message: "登录密码不能为空", trigger: "blur"}
    ],
    inductionDate: [
      {required: true, message: "入职日期不能为空", trigger: "blur"}
    ],
    deptId: [
      {required: true, message: "部门不能为空", trigger: "blur"}
    ],
    postId: [
      {required: true, message: "岗位不能为空", trigger: "blur"}
    ],
  }
})
const form = ref({})

// 表单重置
function reset() {
  form.value = {
    status: '0',
    empType: '1',
    postLevel: '',
    partTimeInfo: []
  };
}

// 折叠面板--展开值
const foldList = ref([1])

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


/* 新增 */
function handleAdd() {
  reset()
  formInfo.formVisible = true
  formInfo.formTitle = '添加用户'
}

/* 修改 */
function handleUpdate(row) {
  reset()
  formInfo.formVisible = true
  const paramsQuery = {
    userId: row.userId
  }
  // 获取用户信息
  getUserInfo(paramsQuery).then(res => {
    form.value = res.data
  })
}

/* 删除 */
function handleDelete(row) {

}

/* 更多操作触发 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
}

/* 重置密码 */
function handleResetPwd() {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
  }).then(({value}) => {
    resetUserPwd(row.userId, value).then(() => {
      ElMessage.success(`修改成功，新密码是：${value}`);
    })
  }).catch(() => {
  })
}

/* 分配角色 */
const router = useRouter()

function handleAuthRole() {
  const userId = row.userId
  router.push("/system/user-auth/role/" + userId);
}

/* 保存 */
const userFormRef = ref(null)

function handleSubmitForm() {
  userFormRef.value.validate(valid => {
    if (valid) {
      console.log('form', form.value)
      if (form.value.userId) {
        updateUser(form.value).then(() => {
          ElMessage.success('修改成功')
          formInfo.formVisible = false
          fetchData()
        })
      } else {
        addUser(form.value).then(() => {
          ElMessage.success('新增成功')
          formInfo.formVisible = false
          fetchData()
        })
      }
    }
  })
}

/* 取消 */
function handleCancel() {
  formInfo.formVisible = false
}

/* 兼任操作表格 */
/* 校验是否 */
function verifyPart() {
  let pass = true
  for (let i = 0; i < form.value.partTimeInfo.length; i++) {
    const partItem = form.value.partTimeInfo[i]
    if (partItem.deptId === '' && partItem.postId === '') {
      pass = false
      ElMessage.warning(`第${i + 1}行有选项未填`)
      break;
    }
  }
  return pass
}

/* 添加兼任 */
function handleAddPart() {
  const partItem = Object.assign({}, {
    deptId: "",
    deptName: "",
    postId: "",
    postName: "",
    ptId: ""
  })
  verifyPart() && form.value.partTimeInfo.push(partItem)
}

/* 生命周期函数 */
onMounted(async () => {
  fetchData()
  getDeptList()
  getPostList()
  getAllRoleList()
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

.part-table {
  ul, li {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .head-box {
    .li-column-1 {
      background: #eeeeee;
      font-weight: bold;
      font-size: 14px;
    }
  }

  .li-column-1 {
    font-size: 14px;
    min-width: 160px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  margin: 3.2px 0 0 5px;
}
</style>
