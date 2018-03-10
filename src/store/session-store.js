import storageService from '@/services/storage-service';
import { LOADING_INCREMENT, LOADING_DECREMENT, SESSION_LOGIN_SUCCESS, SESSION_LOGIN_PENDING, SESSION_LOGIN_FAILURE, SESSION_LOGOUT } from './mutations';

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
            commit(LOADING_INCREMENT, null, { root: true }); // todo zu http verschieben
            // todo commit global readonly for all interactive elements (und bei succ/fail wieder weg)
            await new Promise(((resolve) => {
                setTimeout(() => {
                    /* if error
                    const cause = 'login error description';
                    commit(LOGIN_FAILURE, cause);
                    else */
                    commit(SESSION_LOGIN_SUCCESS, {
                        username: 'dummy',
                        email: 'e@mail.com',
                    });
                    // }
                    commit(LOADING_DECREMENT, null, { root: true });
                    resolve();
                }, 1000);
            }));
        },
    },
};
