<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter.native="handleQuery"
            class="form-item"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable="true" class="form-item">
          <el-option label="开启" :value="0"/>
          <el-option label="关闭" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="btn-line">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            :icon="Plus"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            :icon="SortUp"
            @click="$refs.menuTableRef.setAllTreeExpand(true)"
        >展开
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            :icon="SortDown"
            @click="$refs.menuTableRef.clearTreeExpand()"
        >折叠
        </el-button>
      </el-col>
    </el-row>
    <vxe-table
        ref="menuTableRef"
        :loading="tableInfo.loading"
        max-height="400"
        :tree-config="{transform: true, rowField: 'menuId', parentField: 'parentId'}"
        :data="tableInfo.menuList">
      <vxe-column width="20px"></vxe-column>
      <vxe-column field="menuName" title="菜单名称" tree-node min-width="120"></vxe-column>
      <vxe-column field="orderNum" title="排序" min-width="120"></vxe-column>
      <vxe-column field="component" title="组件路径" min-width="120">
        <template #default="{row}">
          <span>{{ row.component || '-' }}</span>
        </template>
      </vxe-column>
      <vxe-column field="status" title="状态" min-width="120"></vxe-column>
      <vxe-column field="createdTime" title="创建时间" min-width="120"></vxe-column>
      <vxe-column title="操作" min-width="240" fixed="right">
        <template #default="{row}">
          <el-button
              :icon="Edit"
              type="text"
              @click="handleUpdate(row)"
          >修改
          </el-button>
          <el-button
              type="text"
              :icon="Plus"
              @click="handleAdd(row)"
          >新增
          </el-button>
          <el-button
              type="text"
              :icon="Delete"
              @click="handleDelete(row)"
          >删除
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="formInfo.formTitle" v-model="formInfo.formVisible" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="formInfo.rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                  v-model="form.parentId"
                  :data="menuOptions"
                  :render-after-expand="false"
              >
                <template #default="{ data: { menuName } }">{{ menuName }}</template>
              </el-tree-select>
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
          <el-col :span="24" v-if="form.menuType !== 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-select v-model="form.icon" class="m-2" placeholder="请选择图标">
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
              <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0" disabled>是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'M'">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item>
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item>
              <span slot="label">
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
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                显示状态
              </span>
<!--              <el-radio-group v-model="form.visible">-->
<!--                <el-radio-->
<!--                    v-for="dict in dict.type.sys_show_hide"-->
<!--                    :key="dict.value"-->
<!--                    :label="dict.value"-->
<!--                >{{dict.label}}</el-radio>-->
<!--              </el-radio-group>-->
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <el-icon><QuestionFilled/></el-icon>
                </el-tooltip>
                菜单状态
              </span>
<!--              <el-radio-group v-model="form.status">-->
<!--                <el-radio-->
<!--                    v-for="dict in dict.type.sys_normal_disable"-->
<!--                    :key="dict.value"-->
<!--                    :label="dict.value"-->
<!--                >{{dict.label}}</el-radio>-->
<!--              </el-radio-group>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {listMenu} from "@/api/system/menu.js";
import IconSelect from "@/components/IconSelect/index.vue"
import {SortDown, SortUp, Search, Refresh, Delete, Edit, Plus, Sort, QuestionFilled} from '@element-plus/icons-vue'
import iconList from "@/components/IconSelect/requireIcons.js"
import {handleTree} from "../../../utils/gitone.js";
// 查修参数
const queryParams = ref({})
// 表格信息
const tableInfo = reactive({
  menuList: [],
  loading: false
})
// 弹窗信息
const formInfo = reactive({
  formTitle: '',
  formVisible: false,
  // 保存时的加载
  saveLoading: false,
  rules: {
    menuName: [
      {required: true, message: "菜单名称不能为空", trigger: "blur"}
    ],
    orderNum: [
      {required: true, message: "菜单顺序不能为空", trigger: "blur"}
    ],
    path: [
      {required: true, message: "路由地址不能为空", trigger: "blur"}
    ]
  },
})

const form = reactive({
  parentId: '',
  menuType: 'M'

})

/* 获取表格数据 */
function fetchData() {
  tableInfo.loading = true;
  listMenu(queryParams).then(res => {
    tableInfo.menuList = res.data
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
  // this.resetForm("queryForm");
  handleQuery();
}

/* 修改 */
function handleUpdate() {
  formInfo.formTitle = '修改菜单'
  formInfo.formVisible = true
}

/* 添加 */
function handleAdd() {
  formInfo.formTitle = '新增菜单'
  formInfo.formVisible = true
}

/* 删除 */
function handleDelete() {
}

/* 弹窗保存提交 */
function handleSubmitForm() {
  formInfo.formVisible = false
}

/* 弹窗取消 */
function handleCancel() {
  formInfo.formVisible = false
}

/** 查询菜单下拉树结构 */
const menuOptions = ref([])

function getTreeSelect() {
  listMenu().then(res => {
    menuOptions.value = [];
    const menu = {menuId: 0, menuName: '主类目', children: []};
    menu.children = res.data
    menu.children = handleTree(res.data, "menuId");
    menuOptions.value.push(menu);
  });
}

// 表单重置
function reset() {
  form.value = {
    menuId: undefined,
    parentId: 0,
    menuName: undefined,
    icon: undefined,
    menuType: "M",
    orderNum: undefined,
    isFrame: "1",
    isCache: "0",
    visible: "0",
    status: "0"
  };
  // this.resetForm("form");
}

// 选择图标
function selected(name) {
  form.icon = name;
}

onMounted(() => {
  fetchData()
  getTreeSelect()
  reset()
})
</script>

<style scoped lang="scss">
.dialog-footer {
  float: right;
}
</style>
