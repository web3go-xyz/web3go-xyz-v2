import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
    path: '/',
    name: '/',
    redirect: { name: 'Dashboard' }
}, {
    path: '/Dashboard',
    name: 'Dashboard',
    component: () =>
        import("@/views/HelloWorld/index.vue")
}, {
    path: '/accountSetting',
    name: 'accountSetting',
    component: () =>
        import("@/views/accountSetting/index.vue")
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router