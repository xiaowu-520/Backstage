import PageTools from '@/components/PageTools'
import MyTest from '@/components/MyTest'
import UploadExcel from '@/components/uploadExcel'
import UploadImg from './UploadImg'
const components = [PageTools, MyTest, UploadExcel,UploadImg]
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  }
}
