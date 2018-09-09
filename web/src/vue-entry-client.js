import createApp from './vue-app';

const { app, router } = createApp();

router.onReady(() => {
    app.$mount('#app');
});
