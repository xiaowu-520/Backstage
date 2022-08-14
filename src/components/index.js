import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/uploadExcel'
const components = [PageTools]
export default {
    install(Vue){
        components.forEach((component) => {
            Vue.component(component.name,component)
            Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
        })
    }
}