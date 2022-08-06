<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card" v-loading="loading">
        <!-- 用了一个行列布局 -->
        <treeTools :treeNode="company" :is-root="true" @add="showAddDept" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <template v-slot="{ data }">
            <treeTools
              :treeNode="data"
              @remove="getDepartments"
              @add="showAddDept"
              @edit="showEdit"
            />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 添加部门弹层 -->
    <addDept
      @addSuccess="getDepartments"
      :visible.sync="dialogVisible"
      :currentNode="currentNode"
      ref="addDept"
    />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept.vue'
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '传智播客', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },

  components: {
    treeTools,
    addDept
  },

  created() {
    this.getDepartments()
  },

  methods: {
    //  获取数据
    async getDepartments() {
      try {
        this.loading = true
        const res = await getDepartments()
        console.log(res)
        this.departs = tranListToTreeData(res.depts, '')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 传递当前点击的部门数据
    showAddDept(val) {
      this.dialogVisible = true
      this.currentNode = val
    },
    // 编辑
    showEdit(val) {
      this.dialogVisible = true
      this.$refs.addDept.getDeptById(val.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
