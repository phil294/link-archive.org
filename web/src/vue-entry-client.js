import Vue from 'vue';
import createApp from './vue-app';

/* eslint-disable */

const { app, router, store } = createApp();

Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to,
            }).then(next).catch(next)
        } else {
            next();
        }
    }
});

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);

        // non-previously-rendered components:
        let diffed = false;
        // const activatedAsyncDataHooks = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c))) // todo
        const activatedAsyncDataHooks = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c));
        })
            .map(c => c.asyncData)
            .filter(_ => _);
        if (!activatedAsyncDataHooks.length)
            return next();

        // call all asyncData()
        // todo loading indicator
        Promise.all(activated.map(hook => hook({ store, route: to })))
            .then(() => {
            // stop loading indicator
            next();
        }).catch(next); // stop loading indicator..??
    });
    
    app.$mount('#app');
});