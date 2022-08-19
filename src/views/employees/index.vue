<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共166条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="addEmployee"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showErCodeDialog(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="onAssignRole(row)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployee
      :visible.sync="showAddEmployee"
      @add-success="getEmployeeList"
    />
    <!-- 头像二维码 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @close="showCodeDialog = false"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色分配 -->
    <AssignRole :showRoleDialog.sync="showRoleDialog" :userId="AssignRoleId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employess'
import employess from '@/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import QrCode from 'qrcode'
const { exportExcelMapPath, hireType } = employess
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 5
      },
      showAddEmployee: false,
      showCodeDialog: false,
      showRoleDialog:false,
      AssignRoleId:''
    }
  },

  created() {
    this.getEmployeeList()
  },

  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formOfEmployment(row, column, cellValue, index) {
      const findItem = employess.hireType.find((item) => item.id === cellValue)
      return findItem ? findItem.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('是否删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    addEmployee() {
      this.showAddEmployee = true
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.page.total
      })
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const findItem = hireType.find((hire) => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return findItem ? findItem.value : '未知'
          }
        })
      })
      export_json_to_excel({
        header,
        data,
        filename: '员工列表',
        autoWidth: true,
        bookType: 'xlsx'
      })
    },
    // 二维码弹框
    showErCodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.error('该用户未设置头像')
      this.showCodeDialog = true
      // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
      this.$nextTick(() => {
        // 此时可以确认已经有ref对象了
        QrCode.toCanvas(this.$refs.myCanvas, staffPhoto) // 将地址转化成二维码
        // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
      })
    },
    // 打开角色对话框
    onAssignRole(val){
      this.showRoleDialog = true
      this.AssignRoleId = val.id
    }
  }
}
</script>

<style scoped lang="less"></style>
