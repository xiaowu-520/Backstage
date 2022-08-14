<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <TreeTools
          :treeNode="company"
          :isRoot="true"
          @add="dialogVisible = true"
        />
        <!-- 树形 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
          @remove="getDeptsApi"
        >
          <template v-slot="{ data }">
            <TreeTools :treeNode="data" @add="showAddDept" @edit="showEdit" />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 添加部门弹层 -->
    <AddDept
      :visible.sync="dialogVisible"
      :currentNode="currentNode"
      @addDepts="getDeptsApi"
      ref="addDept"
    />
  </div>
</template>

<script>
import TreeTools from './compoents/tree-tools.vue'
import AddDept from './compoents/add-dept.vue'
import { getDeptsApi } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' }
      ],
      company: { name: '传智教育', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },

  created() {
    this.getDeptsApi()
  },

  methods: {
    async getDeptsApi() {
      this.loading = true
      const res = await getDeptsApi()
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    showAddDept(val) {
      this.dialogVisible = true
      // console.log(val)
      this.currentNode = val
    },
    showEdit(val) {
      this.dialogVisible = true
      this.$refs.addDept.getDeptById(val.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
