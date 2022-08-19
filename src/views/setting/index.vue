<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" size="small" @click="dialogVisible = true"
            >新增角色</el-button
          >
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column
              label="序号"
              width="119"
              type="index"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="角色"
              width="240"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              width="646"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              width="645"
              align="center"
            >
              <template>
                <el-button size="small" type="success" @click="showPermDg">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form ref="form" label-width="80px">
            <el-form-item label="公司名称">
              <el-input disabled v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled v-model="formData.companyAddress"></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input disabled v-model="formData.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="onClose"
    >
      <el-form
        ref="form"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 给角色分配权限 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permissions"
        :props="{label:'name'}"
        show-checkbox
        check-strictly
        default-expand-all
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi, addRolesApi, getCompanyInfo } from '@/api/role'
import {getPermissionList} from '@/api/permission'
import {tranListToTreeData} from '@/utils/index'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pageSize: 3,
      page: 1,
      dialogVisible: false,
      showPermDialog:false,
      addRoleFormRules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      addRoleForm: {
        name: '',
        description: ''
      },
      formData: {},
      permissions:[], // 专门用来接收权限数据 树形数据
       selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },

  created() {
    this.getRoles()
    this.getCompanyInfo()
    this.getPermissions()
  },

  methods: {
    async getRoles() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pageSize
      })
      this.tableData = rows
      this.total = total
    },
    currentChange(val) {
      this.page = val
      this.getRoles()
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    onClose() {
      this.dialogVisible = false
    },
    async onAddRole() {
      await this.$refs.form.validate()
      await addRolesApi(this.addRoleForm)
      this.dialogVisible = false
      this.getRoles()
    },
    dialogClose() {
      this.$refs.form.resetFields()
      this.addRoleForm.region = ''
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(
        this.$store.state.user.userInfo.companyId
      )
      this.formData = res
    },
    // 关闭分配权限弹层
    btnPermCancel(){
      this.showPermDialog = false
    },
    showPermDg(){
      this.showPermDialog = true
    },
    // 保存权限
    btnPermOK(){},
    // 获取权限列表
    async getPermissions(){
      const res = await getPermissionList()
      const treePermission = await tranListToTreeData(res,'0')
      this.permissions = treePermission
    }
  }
}
</script>

<style scoped lang="less"></style>
