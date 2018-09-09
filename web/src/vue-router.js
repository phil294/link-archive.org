import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default function createRouter() {
    return new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/logincallback',
                name: 'LoginCallbackHandler',
                component: () => import('@/components/callback-handlers/LoginCallbackHandler'),
            },
        ],
    });
}
