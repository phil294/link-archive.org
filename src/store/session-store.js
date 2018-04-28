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
            // we trust the given token to be valid and set it as standard authentification header & session email
            const payload = JSON.parse(window.atob(token.split('.')[1].replace('-', '+').replace('_', '/')));
            const email = payload.email;
            commit('setToken', token);
            commit('setEmail', email);
            storageService.setEmail(email);
            storageService.setToken(token);
        },
        async [SESSION_REQUEST_TOKEN_MAIL](_, email) {
            await httpService.get(`requesttokenmail?email=${email}`);
        },
        [SESSION_LOGOUT]({ commit }) {
            commit('setEmail', null);
            commit('setToken', null);
            storageService.setEmail(null);
            storageService.setToken(null);
        },
    },
};
