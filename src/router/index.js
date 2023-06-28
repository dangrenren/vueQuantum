import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404.vue')
    },
    {
        path: '/front',
        name: 'Front',
        component: () => import('../views/front/Front'),
        children: [
            {
                path: 'home',
                name: 'FrontHome',
                component: () => import('../views/front/Home.vue')
            },
            {
                path: 'item1',
                name: 'Item1',
                component: () => import('../views/front/Item1.vue')
            },
            {
                path: 'person',
                name: 'FrontPerson',
                component: () => import('../views/front/Person')
            },
            {
                path: 'password',
                name: 'FrontPassword',
                component: () => import('../views/front/Password')
            },
            {
                path: 'article',
                name: 'FrontArticle',
                component: () => import('../views/front/Article')
            },
            {
                path: 'articleDetail',
                name: 'ArticleDetail',
                component: () => import('../views/front/ArticleDetail')
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export const setRoutes=() => {
    const storeMenus=localStorage.getItem("menus");
    if(storeMenus) {
        const manageRoute = {
            path: '/',
            name: 'manage',
            component: () => import('../views/Manage.vue'),
            redirect: '/home',
            children: [ { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
                        { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')}
                      ]
        }
        const menus = JSON.parse(storeMenus);//将json字符串转换为json对象
        menus.forEach(item => {
            //将vue组件页面添加到路由children中
            //因为上面父路由已经有了/,所以子路由需哟去掉/
            if (item.path) {//没有子菜单的一级菜单，其path属性不为空，给他设置路由
                let menuRoute = {
                    path: item.path.replace("/", ""),
                    name: item.name,
                    component: () => import('../views/' + item.pagePath + '.vue')
                }
                manageRoute.children.push(menuRoute)
            } else if (item.children.length) {//有子菜单的一级菜单，其path属性为空，给他子菜单设置路由
                item.children.forEach(item2 => {
                    if (item2.path) {
                        let menuRoute = {
                            path: item2.path.replace("/", ""),
                            name: item2.name,
                            component: () => import('../views/' + item2.pagePath + '.vue')
                        }
                        manageRoute.children.push(menuRoute)
                    }
                })
            }

        })
        const currentRouter = router.getRoutes().map(v => v.name);
        if (!currentRouter.includes('manage')) {//router已经有了路由，就不再添加了。
            router.addRoute(manageRoute)
        }
    }
}
//刷新页面后，路由会消失，这里再重新设置路由
setRoutes()

// 路由守卫
router.beforeEach((to, from, next) => {
    localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
    store.commit("setPath")  // 触发store的数据更新
    /*
    //这种写法不行，因为用户未登录用户的路由是空的，会导致不会放行
    if(localStorage.getItem("menus")) {//如果有menus，代表用户已经登录
        if(!to.matched.length) {//未找到路由的情况，就跳转到'404'页面
            next("/404")
         }else {
            next()//放行
        }
    }else {//如果没有menus，代表用户未登录，就跳转到登录页面
        next("/login")//放行
    }
    */


    // 未找到路由的情况
    if (!to.matched.length) {
        const storeMenus = localStorage.getItem("menus")
        if (storeMenus) {
            next("/404")
        } else {
            // 跳回登录页面
            next("/login")
        }
    }
    // 其他的情况都放行
    next()
})

export default router
