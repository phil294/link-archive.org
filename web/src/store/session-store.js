import storageService from '@/services/storage-service';
import axios from 'axios';

export default {
	namespaced: true,
	state: {
		token: null,
		session: null,
	},
	getters: {
		isLoggedIn(state) {
			return !!state.session;
		},
	},
	mutations: {
		setToken(state, token) {
			state.token = token;
		},
		setSession(state, session) {
			state.session = session;
		},
	},
	actions: {
		/** validate token and set token & session. throws */
		loginWithToken({ commit }, token) {
			let payload;
			try {
				payload = JSON.parse(window.atob(token.trim().split('.')[1].replace('-', '+').replace('_', '/')));
			} catch (error) {
				throw new Error('Malformed token');
			}
			const session = payload;
			if (!session.email && !session.externalType)
				throw new Error('Invalid token: no email and no externalType');

			commit('setToken', token);
			storageService.setToken(token);
			commit('setSession', session);
		},
		async requestTokenMail(_, email) {
			await axios.get(`authentication/requesttokenmail?email=${email}`);
		},
		async externalLoginProviderLoginWithToken({ dispatch }, { token, providerName }) {
			const response = await axios.post(`authentication/${providerName}tokenlogin?token=${token}`);
			const jwt = response.data;
			dispatch(SESSION_LOGIN_WITH_TOKEN, jwt);
		},
		logout({ commit }) {
			commit('setToken', null);
			commit('setSession', null);
			storageService.setToken(null);
		},
	},
};
