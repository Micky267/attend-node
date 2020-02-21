import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UpdatePW from '../views/UpdatePW.vue'
import Student from '../views/student/Student.vue'
import MyAttend from '../views/student/MyAttend.vue'
import Other from '../views/student/Other.vue'
import Admin from '../views/admin/Admin.vue'
import Statistics from '../views/admin/Statistics.vue'
import StuDatas from '../views/admin/StuDatas.vue'
import TeaDatas from '../views/admin/TeaDatas.vue'
import Teacher from '../views/teacher/Teacher.vue'
import AttendRecord from '../views/teacher/AttendRecord.vue'
import AttendInit from '../views/teacher/AttendInit.vue'
import TeacherAttend from '../views/teacher/TeacherAttend.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/updatePW',
    name: 'updatePW',
    component: UpdatePW
  },
  {
    path: '/user',
    component: Home,
    children: [
      {
        path: 'student',
        redirect: 'student/my-attend',
        component: Student,
        children: [
          { 
            path: 'my-attend', 
            component: MyAttend, 
          },
          { 
            path: 'other', 
            component: Other, 
          },
        ]
      },
      {
        path: 'teacher',
        redirect: 'teacher/attend-record',
        component: Teacher,
        children: [
          { 
            path: 'attend-record', 
            component: AttendRecord, 
          },
          { 
            path: 'attend-init', 
            component: AttendInit, 
          },
          { 
            path: 'teacher-attend/:id', 
            component: TeacherAttend, 
          },
        ]
      },
      {
        path: 'admin',
        redirect: 'admin/statistics',
        component: Admin,
        children: [
          { 
            path: 'statistics', 
            component: Statistics, 
          },
          { 
            path: 'stu-datas', 
            component: StuDatas, 
          },
          { 
            path: 'tea-datas', 
            component: TeaDatas, 
          },
        ]
      },
    ]
  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
