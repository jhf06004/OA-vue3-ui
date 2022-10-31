<template>
  <div>
    <div ref="pageContainerRef" class="page-container">
      <div class="dept-container">
        <div class="left-tree">
          <div>
            <el-input v-model="filterText" clearable placeholder="请输入部门名称关键字"/>
            <el-tree ref="deptTreeRef" :data="deptTreeInfo.DeptData" :filter-node-method="filterNode"
                     :props="defaultProps"
                     @node-click="handleDeptNodeClick"/>
          </div>
        </div>
        <div class="line"></div>
        <div class="right-info">
          <el-form ref="queryForm" :inline="true" :model="queryParams">
            <el-form-item label="姓名" prop="nickName">
              <el-input
                  v-model="queryParams.nickName"
                  class="search-item"
                  clearable
                  placeholder="请输入姓名"
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="phonenumber">
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
  </div>
</template>

<script setup>
import {onMounted, reactive, watch, ref, nextTick} from "vue";
import {treeSelect} from "@/api/system/dept.js";
import {Search, Refresh, Delete, Edit, Plus, Sort, QuestionFilled} from '@element-plus/icons-vue'
import {listUser} from "@/api/system/user.js";
import Pagination from "@/components/Pagination/index.vue"

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

/* 获取部门的树形结构 */
function getDeptTreeData() {
  treeSelect().then(res => {
    deptTreeInfo.DeptData = res.data
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

/* 获取列表数据 */
function fetchData() {
  tableInfo.loading = true
  listUser(queryParams.value).then(res => {
    console.log(res)
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

/**/
function handleUpdate(row) {
}

function handleDelete(row) {
}

onMounted(() => {
  fetchData()
  getDeptTreeData()
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
