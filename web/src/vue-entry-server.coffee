import createApp from './vue-app'

export default (context) => new Promise((ok, notok) =>
	{ app, router, store } = createApp()
	router.push(context.url)
	router.onReady( =>
		matchedComponents = router.getMatchedComponents()
		if !matchedComponents.length
			return notok({ code: 404 })
		Promise.all(matchedComponents.map((Component) =>
			if Component.asyncData
				return Component.asyncData(
					store: store
					route: router.currentRoute)
		)).then( =>
			context.state = store.state # eslint-disable-line no-param-reassign
			ok(app)
		).catch(notok)
	, notok)
)
