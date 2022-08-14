import Layout from '@/layout'

export default{
    path: '/import',
    component: Layout,    
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
}