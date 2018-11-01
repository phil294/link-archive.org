import { SESSION_LOGIN_WITH_TOKEN } from '@/store/actions';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import axios from 'axios';
import App from './App';
import createRouter from './vue-router';
import createStore from './store/root-store';
import storageService from '@/services/storage-service';

Vue.config.productionTip = false; // todo ? // = process.env.NODE_ENV === 'production'  .. ?

export default function createApp() {
	const router = createRouter();
	const store = createStore();
	sync(store, router);

	axios.defaults.baseURL = process.env.API_ROOT;
	axios.interceptors.request.use((config) => {
		config.headers.common.Authorization = `Bearer ${store.state.session.token}`; // eslint-disable-line no-param-reassign
		return config;
	});

	const app = new Vue({
		router,
		store,
		async beforeMount() {
			await this.$nextTick();
			/** ************* CLIENT-ONLY DOM MODIFICATION ***************
			/* Needs to happen after $nextTick so the ssr hydration
			 * check does not consider the below changes. In other words,
			 * the lines below may make the page look different than
			 * what the server-side rendered html looks like.
			 * Right now, this only includes session data (setting jwt)
			 * which is not part of ssr (client-only, for API
			 * interaction)
			 */
			const token = storageService.getToken();
			if (token) {
				this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, token);
			}
		},
		render: h => h(App),
	});
	return { app, router, store };
}
