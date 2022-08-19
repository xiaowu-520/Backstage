<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @open="onOpen">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="assignRole">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRolesApi } from '@/api/role'
import {getUserDetail} from '@/api/user'
import {assignRoles} from '@/api/employess'
export default {
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  created() {},
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRolesApi()
      this.list = rows
    //   console.log(rows)
    },
    close() {
      this.$emit('update:showRoleDialog', false)
    },
    onOpen() {
      this.getRoleList()
      this.getEmployeesRoles()
    },
    // 获取员工角色
    async getEmployeesRoles(){
        const {roleIds} = await getUserDetail(this.userId)
        // console.log(roleIds);
        this.roleIds = roleIds
    },
    // 分配角色权限
    async assignRole(){
        if(!this.roleIds.length) return this.$message.error('请选择角色')
        await assignRoles({
            id: this.userId, 
            roleIds: this.roleIds
        })
        this.$message.success('分配成功')
        this.close()
    }
  }
}
</script>
