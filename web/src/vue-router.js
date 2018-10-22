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
			{
				path: '/',
				name: 'Index',
				component: () => import('@/components/Index'),
			},
			// corresponding store modules can also be lazyloaded. see ssr vuejs docs
		],
	});
}
