import storageService from '@/services/storage-service';
import { SESSION_LOGIN_SUCCESS, SESSION_LOGIN_PENDING, SESSION_LOGIN_FAILURE, SESSION_LOGOUT, HIDE_LOGIN_MODAL } from './mutations';

export default {
    namespaced: true,
    state: {
        username: storageService.getUsername(),
        email: storageService.getEmail(),
        errorMessage: '',
    },
    getters: {
        isLoggedIn(state) {
            return state.username !== null;
        },
    },
    mutations: {
        [SESSION_LOGIN_PENDING](state) {
            state.errorMessage = '';
        },
        [SESSION_LOGIN_SUCCESS](state, sessionPayload) {
            state.username = sessionPayload.username;
            storageService.setUsername(sessionPayload.username);
            state.email = sessionPayload.email;
            storageService.setEmail(sessionPayload.email);
            // state.token = sessionPayload.token; // using httpOnly-cookie instead
        },
        [SESSION_LOGIN_FAILURE](state, cause) {
            state.errorMessage = cause;
        },
        [SESSION_LOGOUT](state) {
            state.username = null;
            storageService.setUsername(null);
            state.email = null;
            storageService.setEmail(null);
        },
    },
    actions: {
        async loginCredentials({ commit }) {
            commit(SESSION_LOGIN_PENDING);
            await new Promise(((resolve) => { // todo
                setTimeout(() => {
                    /* if error {
                    commit(LOGIN_FAILURE, cause); }
                    else { */
                    commit(SESSION_LOGIN_SUCCESS, {
                        username: 'Dummyuser',
                        email: 'user@example.com',
                    });
                    // }
                    commit(HIDE_LOGIN_MODAL, null, { root: true });
                    resolve();
                }, 1000);
            }));
        },
    },
};
