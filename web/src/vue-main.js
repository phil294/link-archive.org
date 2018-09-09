import { SESSION_LOGIN_WITH_TOKEN } from '@/store/actions';
import Vue from 'vue';
import axios from 'axios';
import App from './App';
import router from './vue-router';
import store from './store/root-store';
import storageService from '@/services/storage-service';

Vue.config.productionTip = false; // todo ? // = process.env.NODE_ENV === 'production'  .. ?

axios.defaults.baseURL = process.env.API_ROOT;
axios.interceptors.request.use((config) => {
    config.headers.common.Authorization = `Bearer ${store.state.session.token}`; // eslint-disable-line no-param-reassign
    return config;
});

/* eslint-disable-next-line no-new */
new Vue({
    el: '#app',
    store,
    router,
    created() {
        const token = storageService.getToken();
        if (token) {
            this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, token);
        }
    },
    render: h => h(App),
});
