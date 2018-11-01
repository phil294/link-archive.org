import storageService from '@/services/storage-service';
import axios from 'axios';
import {
	SESSION_REQUEST_TOKEN_MAIL, SESSION_LOGIN_WITH_TOKEN, SESSION_LOGOUT, SESSION_GOOGLE_TOKEN_LOGIN, SESSION_FACEBOOK_TOKEN_LOGIN,
} from './actions';

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
		[SESSION_LOGIN_WITH_TOKEN]({ commit }, token) {
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
		async [SESSION_REQUEST_TOKEN_MAIL](_, email) {
			await axios.get(`authentication/requesttokenmail?email=${email}`);
		},
		async [SESSION_GOOGLE_TOKEN_LOGIN]({ dispatch }, googleToken) {
			const response = await axios.post(`authentication/googletokenlogin?googletoken=${googleToken}`);
			const jwt = response.data;
			dispatch(SESSION_LOGIN_WITH_TOKEN, jwt);
		},
		async [SESSION_FACEBOOK_TOKEN_LOGIN]({ dispatch }, facebookToken) {
			const response = await axios.post(`authentication/facebooktokenlogin?facebooktoken=${facebookToken}`);
			const jwt = response.data;
			dispatch(SESSION_LOGIN_WITH_TOKEN, jwt);
		},
		[SESSION_LOGOUT]({ commit }) {
			commit('setToken', null);
			commit('setSession', null);
			storageService.setToken(null);
		},
	},
};
