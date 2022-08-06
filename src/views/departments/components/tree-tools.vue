<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown>
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$emit('add',treeNode)">添加子部门</el-dropdown-item>
              <template v-if="!isRoot">
                <el-dropdown-item @click.native="$emit('edit',treeNode)">编辑子部门</el-dropdown-item>
                <el-dropdown-item @click.native="onRemove"
                  >删除子部门</el-dropdown-item
                >
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/department'
export default {
  name: 'treeTools',
  data() {
    return {}
  },
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  created() {},

  methods: {
    // 删除
    async onRemove() {
      try {
        await this.$confirm('确定要删除该部门吗', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delDepartments(this.treeNode.id)
        this.$message.success('删除成功')
        this.$emit('remove')
      } catch (error) {}
    }
  }
}
</script>

<style scoped></style>
