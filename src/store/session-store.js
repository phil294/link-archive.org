import storageService from '@/services/storage-service';
import { SESSION_LOGIN_WITH_CREDENTIALS, SESSION_REGISTER_WITH_CREDENTIALS, SESSION_LOGOUT } from './actions';

export default {
    namespaced: true,
    state: {
        email: storageService.getEmail(),
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
    },
    actions: {
        async [SESSION_LOGIN_WITH_CREDENTIALS]({ commit }, { email, password }) {
            /* eslint-disable-next-line no-unused-vars */
            await new Promise(((resolve, reject) => { // todo
                setTimeout(() => {
                    commit('setEmail', email);
                    // commit token... // using httpOnly-cookie instead
                    storageService.setEmail(email);
                    resolve();
                }, 500);
            }));
        },
        async [SESSION_REGISTER_WITH_CREDENTIALS](_, { email, password }) {
            /* eslint-disable-next-line no-unused-vars */
            await new Promise(((resolve, reject) => { // todo
                setTimeout(() => {
                    resolve();
                }, 500);
            }));
        },
        [SESSION_LOGOUT]({ commit }) {
            commit('setEmail', null);
            storageService.setEmail(null);
        },
    },
};

