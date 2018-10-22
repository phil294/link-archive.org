import createApp from './vue-app';

export default context => new Promise((resolve, reject) => {
	const { app, router, store } = createApp();
	router.push(context.url);
	router.onReady(() => {
		const matchedComponents = router.getMatchedComponents();
		if (!matchedComponents.length)
			return reject({ code: 404 });
		Promise.all(matchedComponents.map((Component) => {
			if (Component.asyncData) {
				return Component.asyncData({
					store,
					route: router.currentRoute,
				});
			}
		})).then(() => {
			context.state = store.state; // eslint-disable-line no-param-reassign
			resolve(app);
		}).catch(reject);
	}, reject);
});
