import Vue from 'vue'
import Router from 'vue-router'
//import Home from '@/components/common/Home.vue'
import Test from '@/components/test.vue'
import login from '@/components/Login.vue'
import store from '../store/index'
//import {setCookie,getCookie,delCookie} from '@/config/cookie'


Vue.use(Router)

const router= new Router({
  mode:'history',
  routes: [
    {
      path:'/test',
      component:Test
    },
    {
      path:'*',
      redirect:login,
      meta:{
        isLogin:false
      }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '登录',
            isLogin:false
        }
    },
    {
      path:'/',
      redirect:'/index'
    },
    {
      path: '/',
      name:'home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '平台账户'},
      children:[
        {
          path:'/index',
          name:'index',
          component:resolve => require(['../components/pages/paccount/Index.vue'],resolve),
          meta: {title:'首页'}
        },
        {
          path:'/itemadd',
          component:resolve => require(['../components/pages/paccount/Itemadd.vue'],resolve),
          meta: {title:'项目管理'}
        },
        {
          path:'/whsystem',
          component:resolve => require(['../components/pages/paccount/Whsystem.vue'],resolve),
          meta: {title:'外呼系统'}
        },
        {
          path:'/whdetail',
          name:'whdetail',
          component:resolve => require(['../components/pages/paccount/Whdetail.vue'],resolve),
          meta:{title:'外呼系统详情'}
        },
        {
          path:'/exontotal',
          component:resolve => require(['../components/pages/paccount/Exontotal.vue'],resolve),
          meta: {title:'外显统计'},
        },
        {
          path:'/zhsystem',
          name:'zhsystem',
          component:resolve => require(['../components/pages/paccount/Zhsystem.vue'],resolve),
          meta: {title:'账号管理'},
        },
        {
          path:'/zhdetail',
          name:'zhdetail',
          component:resolve => require(['../components/pages/paccount/Zhdetail.vue'],resolve),
          meta: {title:'账号管理详情'},
        },
        {
          path:'/pmitem',
          name:'pmitem',
          component:resolve => require(['../components/pages/firmAccount/Pmitem.vue'],resolve),
          meta: {title:'项目管理'},
        },
        {
          path:'/pmdetail',
          name:'pmdetail',
          component:resolve => require(['../components/pages/firmAccount/Pmdetail.vue'],resolve),
          meta: {title:'项目管理详情'},
        },
        {
          path:'/pmtask',
          name:'pmtask',
          component:resolve => require(['../components/pages/firmAccount/Pmtask.vue'],resolve),
          meta: {title:'项目管理详情分配任务'},
        },
        {
          path:'/recording',
          name:'recording',
          component:resolve => require(['../components/pages/firmAccount/Recording.vue'],resolve),
          meta: {title:'录音管理'},
        },
        {
          path:'/approve',
          name:'approve',
          component:resolve => require(['../components/pages/firmAccount/Approve.vue'],resolve),
          meta: {title:'认证'},
        },
        {
          path:'/taskmanagement',
          name:'taskmanagement',
          component:resolve => require(['../components/pages/monitors/Taskmanagement.vue'],resolve),
          meta: {title:'任务管理'},
        },
        {
          path:'/taskdetail',
          name:'taskdetail',
          component:resolve => require(['../components/pages/monitors/Taskdetail.vue'],resolve),
          meta: {title:'任务管理详情'},
        },
        {
          path:'/numberpublic',
          name:'numberpublic',
          component:resolve => require(['../components/pages/firmAccount/Numberpublic.vue'],resolve),
          meta: {title:'外显号码'},
        },
        {
          path:'/hybridAccount',
          name:'hybridAccount',
          component:resolve => require(['../components/pages/firmAccount/HybridAccount.vue'],resolve),
          meta: {title:'账号管理'},
        },
        {
          path:'/callee',
          name:'callee',
          component:resolve => require(['../components/pages/amati/Callee.vue'],resolve),
          meta: {title:'外呼'},
        },
        {
          path:'/recall',
          name:'recall',
          component:resolve => require(['../components/pages/amati/Recall.vue'],resolve),
          meta: {title:'外呼'},
        },
        {
          path:'/calleedetail',
          name:'calleedetail',
          component:resolve => require(['../components/pages/amati/Calleedetail.vue'],resolve),
          meta: {title:'外呼详情'},
        },
        {
          path:'/recalldetail',
          name:'recalldetail',
          component:resolve => require(['../components/pages/amati/recalldetail.vue'],resolve),
          meta: {title:'重呼详情'},
        },
        {
          path:'/qualitypage',
          name:'qualitypage',
          component:resolve => require(['../components/pages/Quality/Qualitypage.vue'],resolve),
          meta: {title:'质检'},
        },
        {
          path:'/caccount',
          name:'caccount',
          component:resolve => require(['../components/pages/paccount/CAccount.vue'],resolve),
          meta: {title:'关联账号'},
        }
      ]
    },
    
  ]
})
router.beforeEach((to,from,next) => {
  // let userName=getCookie('userName')
  // if(to.meta.isLogin){
  //   if(userName==""||userName=='undefine'){
  //     next({
  //       path:'/login'
  //     })
  //   }else{
  //     next({
  //       path:'/index'
  //     })
  //   }
  // }
 let token =store.state.token
  if(to.meta.isLogin){
      if(token){
        next()
      }else{
        next({
          path:'/login',
          //query:{redirect:to.fullPath}
        })
      }
  }else{
    next()
  }
})
export default router
