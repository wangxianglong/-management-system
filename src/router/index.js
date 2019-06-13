import Vue from 'vue'
import Router from 'vue-router'
//import Home from '@/components/common/Home.vue'
import Test from '@/components/test.vue'
import login from '@/components/Login.vue'
import roleList from '@/components/pages/user/角色管理.vue'
import addRole from '@/components/pages/user/新增角色.vue'
import updateRole from '@/components/pages/user/修改角色.vue'
import {getCookie} from '@/config/cookie'


Vue.use(Router)

const router= new Router({
  
  routes: [
    {
      path:'/test',
      name:'test',
      component:Test
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
    // {
    //   path:'/',
    //   redirect:'/index'
    // },
    {
      path: '/',
      name:'home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      
      meta: { title: '平台账户',isLogin:true},
      children:[
        {
          path:'/index',
          name:'index',
          component:resolve => require(['../components/pages/paccount/Index.vue'],resolve),
          meta: {title:'首页',isLogin:true}
        },
        {
          path:'/itemadd',
          name:'itemadd',
          component:resolve => require(['../components/pages/paccount/Itemadd.vue'],resolve),
          meta: {title:'项目管理',isLogin:true}
        },
        {
          path:'/whsystem',
          
          component:resolve => require(['../components/pages/paccount/Whsystem.vue'],resolve),
          meta: {title:'外呼系统',isLogin:true}
        },
        {
          path:'/whdetail',
          name:'whdetail',
          component:resolve => require(['../components/pages/paccount/Whdetail.vue'],resolve),
          meta:{title:'外呼系统详情',isLogin:true}
        },
        {
          path:'/exontotal',
          component:resolve => require(['../components/pages/paccount/Exontotal.vue'],resolve),
          meta: {title:'外显统计',isLogin:true},
        },
        {
          path:'/zhsystem',
          name:'zhsystem',
          component:resolve => require(['../components/pages/paccount/Zhsystem.vue'],resolve),
          meta: {title:'账户管理',isLogin:true},
        },
        {
          path:'/zhdetail',
          name:'zhdetail',
          component:resolve => require(['../components/pages/paccount/Zhdetail.vue'],resolve),
          meta: {title:'账户管理详情',isLogin:true},
        },
        {
          path:'/pmitem',
          name:'pmitem',
          component:resolve => require(['../components/pages/firmAccount/Pmitem.vue'],resolve),
          meta: {title:'项目管理',isLogin:true},
        },
        {
          path:'/pmdetail',
          name:'pmdetail',
          component:resolve => require(['../components/pages/firmAccount/Pmdetail.vue'],resolve),
          meta: {title:'项目管理详情',isLogin:true},
        },
        {
          path:'/pmtask',
          name:'pmtask',
          component:resolve => require(['../components/pages/firmAccount/Pmtask.vue'],resolve),
          meta: {title:'项目管理详情分配任务',isLogin:true},
        },
        {
          path:'/recording',
          name:'recording',
          component:resolve => require(['../components/pages/firmAccount/Recording.vue'],resolve),
          meta: {title:'录音管理',isLogin:true},
        },
        {
          path:'/approve',
          name:'approve',
          component:resolve => require(['../components/pages/firmAccount/Approve.vue'],resolve),
          meta: {title:'认证',isLogin:true},
        },
        {
          path:'/taskmanagement',
          name:'taskmanagement',
          component:resolve => require(['../components/pages/monitors/Taskmanagement.vue'],resolve),
          meta: {title:'任务管理',isLogin:true},
        },
        {
          path:'/taskdetail',
          name:'taskdetail',
          component:resolve => require(['../components/pages/monitors/Taskdetail.vue'],resolve),
          meta: {title:'任务管理详情',isLogin:true},
        },
        {
          path:'/numberpublic',
          name:'numberpublic',
          component:resolve => require(['../components/pages/firmAccount/Numberpublic.vue'],resolve),
          meta: {title:'外显号码',isLogin:true},
        },
        {
          path:'/hybridAccount',
          name:'hybridAccount',
          component:resolve => require(['../components/pages/firmAccount/HybridAccount.vue'],resolve),
          meta: {title:'账号管理',isLogin:true},
        },
        {
          path:'/callee',
          name:'callee',
          component:resolve => require(['../components/pages/amati/Callee.vue'],resolve),
          meta: {title:'外呼',isLogin:true},
        },
        {
          path:'/recall',
          name:'recall',
          component:resolve => require(['../components/pages/amati/Recall.vue'],resolve),
          meta: {title:'重呼',isLogin:true},
        },
        {
          path:'/calleedetail',
          name:'calleedetail',
          component:resolve => require(['../components/pages/amati/Calleedetail.vue'],resolve),
          meta: {title:'外呼详情',isLogin:true},
        },
        {
          path:'/recalldetail',
          name:'recalldetail',
          component:resolve => require(['../components/pages/amati/recalldetail.vue'],resolve),
          meta: {title:'重呼详情',isLogin:true},
        },
        {
          path:'/qualitypage',
          name:'qualitypage',
          component:resolve => require(['../components/pages/Quality/Qualitypage.vue'],resolve),
          meta: {title:'质检',isLogin:true},
        },
        {
          path:'/caccount',
          name:'caccount',
          component:resolve => require(['../components/pages/paccount/CAccount.vue'],resolve),
          meta: {title:'关联账号',isLogin:true},
        },
        { path: '/roleList', component: roleList, name: 'roleList', meta:{title:'角色管理',isLogin:true }},
        { path: '/addRole', component: addRole, name: 'addRole',  meta:{title:'新增角色',isLogin:true }},
        { path: '/updateRole', component: updateRole, name: 'updateRole',  meta:{title:'修改角色',isLogin:true }},
        
        {
          path:'/numberPool',
          name:'numberPool',
          component:resolve => require(['../components/pages/paccount/NumberPool.vue'],resolve),
          meta: {title:'号码池管理',isLogin:true},
        },
      ]
    },
    {
      path:'*',
      redirect:login,
      meta:{
        isLogin:false
      }
    },
  ]
})
router.beforeEach((to,from,next) => {
 let token =getCookie('token')
 //console.log(token)
  if(to.meta.isLogin){
      if(token){
        next()
      }else{
        next({
          path:'/login',
          query:{redirect:to.fullPath}
        })
      }
  }else{
    next()
  }
if (to.path === '/login') {
    sessionStorage.removeItem('userName');
  }
  let userName = sessionStorage.getItem('userName');
  if (!userName && to.path !== '/login') {
    next({path: '/login'})
  } else {
    next()
}
    // if(to.path === '/login') {
    //   next();
    // }else{
    //   let token = localStorage.getItem('Authorizations');
    //   if(token === 'null' || token === ''){
    //     next({path: '/login'})
    //   } else {
    //     next()
    //   }
    // }
})
export default router
