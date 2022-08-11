<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" @click="addUser">新增角色</el-button>
          <!-- 表格 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="description" label="地址"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="small" type="success">权限管理</el-button>
                <el-button size="small" type="primary">修改</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            :page-size="params.pagesize"
            :page-sizes="[3, 5, 7, 10]"
            layout="sizes,prev, pager, next"
            :total="total"
            @current-change="changePage"
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
          <el-form ref="form" label-width="80px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input v-model="formData.mailbox" disabled style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加角色对话框 -->
    <el-dialog title="新增角色" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRiles"
        ref="roleForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onAddRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi, addRolesApi, getCompanyInfoApi } from '@/api/role'
export default {
  data() {
    return {
      activeName: 'first',
      total: 0,
      tableData: [],
      addDialogVisible: false,
      params: {
        page: 1,
        pagesize: 10
      },
      addRoleForm: {
        name: '',
        description: ''
      },
      addRoleFormRiles: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      formData:{}
    }
  },

  created() {
    this.getRolesApi()
    this.getCompanyInfoApi()
  },

  methods: {
    // 获取数据
    async getRolesApi() {
      const res = await getRolesApi(this.params)
      console.log(res)
      this.tableData = res.rows
      this.total = res.total
    },
    // 上下页
    changePage(val) {
      this.params.page = val
      this.getRolesApi()
    },
    // 当前页数目
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getRolesApi()
    },
    // 添加弹窗
    addUser() {
      this.addDialogVisible = true
    },
    // 关闭弹窗
    onClose() {
      this.addDialogVisible = false
      this.$refs.roleForm.resetFields()
      this.addRoleForm = {
        name: '',
        description: ''
      }
    },
    // 添加角色
    async onAddRole() {
      await this.$refs.roleForm.validate()
      await addRolesApi(this.addRoleForm)
      this.$message.success('添加成功')
      this.onClose()
      this.getRolesApi()
    },
    // 获取企业信息
    async getCompanyInfoApi() {
      const res = await getCompanyInfoApi(
        this.$store.state.user.userInfo.companyId
      )
      this.formData = res
      console.log(res)
    }
  }
}
</script>

<style scoped lang="less"></style>
