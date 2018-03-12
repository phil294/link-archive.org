import Vuex from 'vuex';
import Vue from 'vue';
import { SHOW_LOGIN_MODAL, HIDE_LOGIN_MODAL } from './mutations';
import session from './session-store';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        loadingCounter: 0,
        loginModal: false,
    },
    mutations: {
        [SHOW_LOGIN_MODAL](state) {
            state.loginModal = true;
        },
        [HIDE_LOGIN_MODAL](state) {
            state.loginModal = false;
        },
    },
    modules: {
        session,
    },
});

export default store;
