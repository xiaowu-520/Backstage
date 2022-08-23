<template>
  <div class="calendar">
    <el-row type="flex" justify="end">
      <el-col :span="5">
        <el-select v-model="currentYear" placeholder="请选择" @change="upDate">
          <el-option
            v-for="item in years"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="currentMonth"
          style="margin-left: 20px"
          placeholder="请选择"
          @change="upDate"
        >
          <el-option v-for="item in 12" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date }">
        <div class="cell-box">
          {{ date.getDate() }}
          <span v-if="isWeek(date)">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentYear: '',
      currentMonth: '',
      currentDate: '',
      years: [] //当前的年份 +前5年 +后5年
    }
  },

  created() {
    this.initCalendar()
  },

  methods: {
    initCalendar() {
      const date = new Date()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.years = Array(11)
        .fill(this.currentYear - 5)
        .map((item, i) => item + i)
      this.currentDate = date
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    },
    // 更新日历
    upDate() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    }
  },

  computed: {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar__header {
  display: none;
}
::v-deep .el-calendar-table__row .current,
::v-deep .el-calendar-table__row .next {
  border: none !important;
}

.cell-box {
  color: green;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
