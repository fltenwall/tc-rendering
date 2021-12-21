import Vue from 'vue'
import Router from 'vue-router'

import * as R from './types'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function (location) {
    return routerPush.call(this, location).catch(error => error)
}

const routes = [
    {
        path: '/',
        name: R.ROOT,
        component: () => import('../pages/test/index.vue')
    },
    {
        path: '/map',
        name: R.MAP,
        component: () => import('../pages/map/index.vue')
    }
]

const router = new Router({
    // mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
    mode: 'hash',
    routes
})

export default router