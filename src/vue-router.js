import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginCallbackHandler from '@/components/callback-handlers/LoginCallbackHandler';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/logincallback',
            name: 'LoginCallbackHandler',
            component: LoginCallbackHandler,
        },
    ],
});
