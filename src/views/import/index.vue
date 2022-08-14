<template>
  <div>
    <uploadExcel :beforeUpload="excelSuccess" :onSuccess="onSuccess" />
  </div>
</template>

<script>
import {importEmployee} from '@/api/employees'
import uploadExcel from '@/components/uploadExcel'
import employees from '@/constant/employees'
const {mapKeyPath} = employees
import dayjs from 'dayjs'
export default {
  data() {
    return {}
  },
  components: {
    uploadExcel
  },
  created() {},

  methods: {
    excelSuccess(file){
      if(!file.name.endsWith('.xlsx')){
        this.$message.error('请选择表格文件')
        return false
      }
      return true
    },
    async onSuccess({header,results}){
      const newArr = results.map((item) => {
        const obj = {}
        for (let key in mapKeyPath){
         if(key === '入职日期' || key === '转正日期'){
          const timestamp = item[key]
          const date = new Date((timestamp -1 ) *24 *3600000)
          date.setFullYear(date.getFullYear() - 70)
          obj[mapKeyPath[key]] = dayjs(date).format('YYYY-MM-DD')
         }else{
           obj[mapKeyPath[key]] = item[key]
         }
        }
        return obj
      })
      console.log(newArr);
      await importEmployee(newArr)
      this.$message.success('导入成功')
    }
  }
}
</script>

<style scoped></style>
