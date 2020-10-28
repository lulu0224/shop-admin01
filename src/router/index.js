import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
const MenuManage =  ()=>import('@/pages/MenuManage') 
const RoleManage =  ()=>import('@/pages/RoleManage') 
const UserManage =  ()=>import('@/pages/UserManage') 
const GoodsCategroy =  ()=>import('@/pages/GoodsCategroy') 
const GoodsSpecs =  ()=>import('@/pages/GoodsSpecs') 
const MemberManage =  ()=>import('@/pages/MemberManage') 
const GoodsManage =  ()=>import('@/pages/GoodsManage') 
const BannerManage =  ()=>import('@/pages/BannerManage') 
const SeckillActivity =  ()=>import('@/pages/SeckillActivity') 


Vue.use(Router)
const router =  new Router({
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Layout,
      children:[{
        path: '/index',
        component: Index,
      }, {
          path: "menu",
          component: MenuManage
        }, {
          path: "role",
          component: RoleManage
        }, {
          path: "user",
          component: UserManage
        }, {
          path: "category",
          component: GoodsCategroy
        }, {
          path: "specs",
          component: GoodsSpecs
        }, {
          path: "goods",
          component: GoodsManage
        }, {
          path: "member",
          component: MemberManage
        }, {
          path: "banner",
          component: BannerManage
        }, {
          path: "seckill",
          component: SeckillActivity
        }, {
        path: '*',
        redirect:"/index"
      }]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  //用token来判断是否登录
  let token = localStorage.getItem("token");
  
   let menusUrl = JSON.parse(localStorage.getItem("info"));
  //如果登录了
  if(token && menusUrl){
    if(to.path == "/login"){
      next(false)
    }else{
      let flag = menusUrl.menus_url.find(item=>(to.path == item));
      if(flag || to.path == "/index"){
        next()
      }else{
        next(false);
      }
    }
  }else{
    //如果没登录
    if(to.path == "/login"){
      next()
    }else{
      next("/login")
    }
  }
})
export default router