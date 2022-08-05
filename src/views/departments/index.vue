<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 用了一个行列布局 -->
        <treeTools :treeNode="company" :is-root="true" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <template v-slot="{ data }">
            <treeTools :treeNode="data" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '传智播客', manager: '负责人' }
    }
  },

  components: {
    treeTools
  },

  created() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      try {
        const res = await getDepartments()
        console.log(res)
        this.departs = tranListToTreeData(res.depts, '')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
