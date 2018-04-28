import Vue from 'vue';
import App from './App';
import router from './vue-router';
import store from './store/root-store';

Vue.config.productionTip = false; // todo ? // = process.env.NODE_ENV === 'production'  .. ?

/* eslint-disable-next-line no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});
