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
    <div>
      <el-dialog v-model="formInfo.formVisible" :title="formInfo.formTitle" append-to-body draggable width="780px">
        <el-form ref="menuFormRef" :model="form" :rules="formInfo.rules" style="padding: 0 40px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级菜单">
                <el-tree-select
                    v-model="form.parentId"
                    :check-strictly="true"
                    :data="menuOptions"
                    :render-after-expand="false"
                ></el-tree-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="menuType">
                <el-radio-group v-model="form.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="24">
              <el-form-item label="菜单图标" prop="icon">
                <el-select v-model="form.icon" class="form-item" placeholder="请选择图标">
                  <el-option
                      v-for="(item,index) in iconList"
                      :key="index"
                      :label="item"
                      :value="item"
                  >
                    <div style="display: flex;align-items: center">
                      <svg-icon :icon-class="item" style="height: 32px;width: 16px;margin-right: 10px"></svg-icon>
                      <span>{{ item }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="form.menuName" placeholder="请输入菜单名称" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number v-model="form.orderNum" :min="0" class="form-item" controls-position="right"/>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                是否外链
              </span>
                <el-radio-group v-model="form.isFrame">
                  <el-radio disabled label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item prop="path">
              <span slot="label" class="form-item-label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                路由地址
              </span>
                <el-input v-model="form.path" class="form-item" placeholder="请输入路由地址"/>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType === 'C'" :span="12">
              <el-form-item prop="component">
              <span slot="label" class="form-item-label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                组件路径
              </span>
                <el-input v-model="form.component" class="form-item" placeholder="请输入组件路径"/>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'M'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                            placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                权限字符
              </span>
                <el-input v-model="form.perms" class="form-item" maxlength="100" placeholder="请输入权限标识"/>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType === 'C'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                路由参数
              </span>
                <el-input v-model="form.query" class="form-item" maxlength="255" placeholder="请输入路由参数"/>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType === 'C'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                是否缓存
              </span>
                <el-radio-group v-model="form.isCache">
                  <el-radio label="0">缓存</el-radio>
                  <el-radio label="1">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                显示状态
              </span>
                <el-radio-group v-model="form.visible">
                  <!--                <el-radio-->
                  <!--                    v-for="dict in dict.type.sys_show_hide"-->
                  <!--                    :key="dict.value"-->
                  <!--                    :label="dict.value"-->
                  <!--                >{{dict.label}}</el-radio>-->
                  <el-radio v-for="(item,key) in menuVisible" :key="key" :label="key">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item>
              <span slot="label" class="form-item-label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                菜单状态
              </span>
                <el-radio-group v-model="form.status">
                  <!--                <el-radio-->
                  <!--                    v-for="dict in dict.type.sys_normal_disable"-->
                  <!--                    :key="dict.value"-->
                  <!--                    :label="dict.value"-->
                  <!--                >{{dict.label}}</el-radio>-->
                  <el-radio v-for="(item,key) in menuStatus" :key="key" :label="key">{{ item.label }}</el-radio>
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
// 弹窗信息
const formInfo = {
  formVisible: false,
  formTitle: '新增',
  saveLoading: false,
  rules: {}
}
const form = {}

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

/* 修改 */
function handleUpdate(row) {
  formInfo.formVisible = true
}

/* 删除 */
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
