import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [{
    path: '/',
    name: '/',
    redirect: { name: 'Dashboard' }
}, {
    path: '/Dashboard',
    name: 'Dashboard',
    meta: {
        title: 'ACE'
    },
    component: () =>
        import("@/views/HelloWorld/index.vue")
}, {
    path: '/BotList',
    name: 'BotList',
    component: () =>
        import("@/views/dashboard/BotList.vue")
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router