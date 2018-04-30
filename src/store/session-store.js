import storageService from '@/services/storage-service';
import httpService from '@/services/http-service';
import { SESSION_REQUEST_TOKEN_MAIL, SESSION_LOGIN_WITH_TOKEN, SESSION_LOGOUT } from './actions';

export default {
    namespaced: true,
    state: {
        email: storageService.getEmail(),
        token: storageService.getToken(),
    },
    getters: {
        isLoggedIn(state) {
            return state.email !== null;
        },
    },
    mutations: {
        setEmail(state, email) {
            state.email = email;
        },
        setToken(state, token) {
            state.token = token;
        },
    },
    actions: {
        [SESSION_LOGIN_WITH_TOKEN]({ commit }, token) {
            let payload;
            try {
                payload = JSON.parse(window.atob(token.trim().split('.')[1].replace('-', '+').replace('_', '/')));
            } catch (error) {
                throw new Error('Malformed token');
            }
            const email = payload.sub;
            if (!email) throw new Error('Invalid token: no email contained');
            commit('setToken', token);
            commit('setEmail', email);
            storageService.setEmail(email);
            storageService.setToken(token);
        },
        async [SESSION_REQUEST_TOKEN_MAIL](_, email) {
            await httpService.get(`authentication/requesttokenmail?email=${email}`);
        },
        [SESSION_LOGOUT]({ commit }) {
            commit('setEmail', null);
            commit('setToken', null);
            storageService.setEmail(null);
            storageService.setToken(null);
        },
    },
};
