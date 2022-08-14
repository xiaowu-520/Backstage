<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部区域 -->
      <page-tools>
        <span slot="tag-left">共166条记录</span>
        <template slot="tag-right">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table :data="employeesList">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                :src="row.staffPhoto"
                v-imgError="imgUrl"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatterOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间">
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatTime
            }}</template>
          </el-table-column>
          <el-table-column label="账户状态">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="onRemove(row.id)"
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
            :total="total"
            :page-size="params.size"
            @current-change="currentChange"
            layout="prev, pager, next"
          />
        </el-row>
      </el-card>
    </div>
    <add-employees
      :showDialog.sync="showDialog"
      @addSuccess="getEmployeeList"
    />
  </div>
</template>

<script>
import { getEmployeeListApi, delEmployee } from '@/api/employees'
import employees from '@/constant/employees'
import AddEmployees from './components/add-employees'
export default {
  data() {
    return {
      imgUrl:
        'https://ts1.cn.mm.bing.net/th/id/R-C.1c25c13d849308de825f6f2f2b9c7320?rik=zdVdEBsVNWSSnQ&riu=http%3a%2f%2fqqwjx.com%2fuploads%2fallimg%2f130724%2f1-130H40S029.jpg&ehk=9a%2f6RFDZMNtowxLRxiUzNjzvfhYeRFOY3mg7LcDuH%2b8%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
      employeesList: [],
      total: 0,
      showDialog: false,
      params: {
        page: 1,
        size: 10
      }
    }
  },
  components: {
    AddEmployees
  },

  created() {
    this.getEmployeeList()
  },

  methods: {
    // 获取员工数据
    async getEmployeeList() {
      const res = await getEmployeeListApi(this.params)
      this.employeesList = res.rows
      this.total = res.total
      // console.log(res)
    },
    // 分页
    currentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatterOfEmployment(row, col, cellValue, index) {
      const findItem = employees.hireType.find((item) => item.id === cellValue)
      return findItem ? findItem.value : '未知'
    },
    // 删除员工
    async onRemove(id) {
      try {
        await this.$confirm('是否删除？')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
