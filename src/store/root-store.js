import Vuex from 'vuex';
import Vue from 'vue';
import { LOADING_INCREMENT, LOADING_DECREMENT } from './mutations';
import session from './session-store';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        loadingCounter: 0,
    },
    mutations: {
        [LOADING_INCREMENT](state) {
            state.loadingCounter++;
        },
        [LOADING_DECREMENT](state) {
            state.loadingCounter--;
        },
    },
    modules: {
        session,
    },
});

export default store;
