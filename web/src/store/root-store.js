import Vuex from 'vuex';
import Vue from 'vue';
import { SHOW_AUTHENTICATE_MODAL, HIDE_AUTHENTICATE_MODAL } from './actions';
import session from './session-store';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        loadingCounter: 0,
        authenticateModal: false,
    },
    mutations: {
        toggleAuthenticateModal(state, show) {
            state.authenticateModal = show;
        },
    },
    actions: {
        [SHOW_AUTHENTICATE_MODAL]({ commit }) {
            commit('toggleAuthenticateModal', true);
        },
        [HIDE_AUTHENTICATE_MODAL]({ commit }) {
            commit('toggleAuthenticateModal', false);
        },
    },
    modules: {
        session,
    },
});

export default store;
