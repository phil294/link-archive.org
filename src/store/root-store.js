import Vuex from 'vuex';
import Vue from 'vue';
import { SHOW_LOGIN_MODAL, HIDE_LOGIN_MODAL } from './actions';
import session from './session-store';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        loadingCounter: 0,
        loginModal: false,
    },
    mutations: {
        toggleLoginModal(state, show) {
            state.loginModal = show;
        },
    },
    actions: {
        [SHOW_LOGIN_MODAL]({ commit }) {
            commit('toggleLoginModal', true);
        },
        [HIDE_LOGIN_MODAL]({ commit }) {
            commit('toggleLoginModal', false);
        },
    },
    modules: {
        session,
    },
});

export default store;
