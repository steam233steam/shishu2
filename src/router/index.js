import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LogView from '@/views/log/index.vue'
import StuView from '@/views/stu/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import StuReportView from '@/views/report/stu/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页：独立页面，不嵌套在 Layout 里
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // 主页：使用 Layout 布局，所有子页面嵌套在里面
    {
      path: '/',
      component: LayoutView,
      redirect: '/index',
      children: [
        { path: 'index', name: 'index', component: IndexView },
        { path: 'clazz', name: 'clazz', component: ClazzView },
        { path: 'stu', name: 'stu', component: StuView },
        { path: 'dept', name: 'dept', component: DeptView },
        { path: 'emp', name: 'emp', component: EmpView },
        { path: 'log', name: 'log', component: LogView },
        { path: 'report/',children:[
          { path: 'emp', name: 'empReport', component: EmpReportView },
          { path: 'stu', name: 'stuReport', component: StuReportView }
        ]}
      ]
    }
  ]
})

export default router



