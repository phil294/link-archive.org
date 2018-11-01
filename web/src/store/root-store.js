import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { SHOW_AUTHENTICATE_MODAL, HIDE_AUTHENTICATE_MODAL } from './actions';
import session from './session-store';

Vue.use(Vuex);

export default function createStore() {
	return new Vuex.Store({
		strict: process.env.NODE_ENV !== 'production', // todo check this
		state: {
            appName: 'My App',
			loadingCounter: 0,
			authenticateModal: false,
			test: {},
		},
		mutations: {
			toggleAuthenticateModal(state, show) {
				state.authenticateModal = show;
			},
			setAppName(state, appName) {
                state.appName = appName;
            }
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
}