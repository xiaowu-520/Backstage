<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="50%"
    :before-close="onClose"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      label-width="100px"
      ref="form"
      :model="formData"
      :rules="formDataRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 100%"
          placeholder="请选择负责人"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          v-model="formData.introduce"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDeptApi,
  getDeptByIdApi,
  editDeptsApi
} from '@/api/department'
import { getEmployeesApi } from '@/api/employees'
export default {
  data() {
    // 校验部门名称
    const checkDeptName = async (rule, value, callback) => {
      if (this.formData.id) {
        const { depts } = await getDepartments()
        const filtersDepts = depts.filter(
          (item) =>
            item.pid === this.formData.pid && item.id !== this.formData.id
        )
        const isRepeat = filtersDepts.some((item) => item.name === value)
        isRepeat ? callback(new Error('部门重复')) : callback()
      } else {
        if (!this.currentNode.children) return callback()
        const isRepeat = this.currentNode.children.some(
          (item) => item.name === value
        )
        isRepeat ? callback(new Error('部门重复')) : callback()
      }
    }
    // 校验部门编码
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      // 判断是保存还是编辑
      if (this.formData.id) {
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value)
      } else {
        isRepeat = depts.some((item) => item.code === value)
      }
      isRepeat ? callback(new Error('部门编码重复')) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      formDataRules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          {
            validator: checkDeptName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            validator: checkDeptCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: 'change'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          }
        ]
      },
      peoples: [] // 接收获取的员工简单列表的数据
    }
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentNode: {
      type: Object,
      required: true
    }
  },

  computed: {
    dialogTitle() {
      return this.formData.id ? '编辑部门' : '添加部门'
    }
  },

  created() {
    this.getEmployeeSimple()
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeesApi()
    },
    // 关闭弹窗
    onClose() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 提交数据
    async onSave() {
      await this.$refs.form.validate()
        //修改部门
      if (this.formData.id) {
        await editDeptsApi(this.formData)
        this.$message.success('修改成功')
        this.onClose()
        this.$emit('addSuccess')
      } else {
        this.formData.pid = this.currentNode.id
        try {
          await addDeptApi(this.formData)
          this.$message.success('添加成功')
          this.onClose()
          this.$emit('addSuccess')
        } catch (error) {
          this.$message.error('添加失败')
        }
      }
    },
    async getDeptById(id) {
      this.formData = await getDeptByIdApi(id)
    }
  }
}
</script>

<style scoped></style>
