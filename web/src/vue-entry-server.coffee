import createApp from './vue-app'

export default (context) => new Promise((ok, notok) =>
	{ app, router, store } = createApp()
	router.push(context.url)
	router.onReady( =>
		matchedComponents = router.getMatchedComponents()
		if !matchedComponents.length
			return notok({ code: 404 })
		Promise.all(matchedComponents.map(Component =>
			# todo crash here does not send res answer but hangs
			asyncDataHook = Component.asyncDataHook || (Component.options || {}).asyncDataHook
			if asyncDataHook
				return Component.options.asyncDataHook(
					store: store
					route: router.currentRoute)
		)).then( =>
			context.state = store.state # eslint-disable-line no-param-reassign
			ok(app)
		).catch(notok)
	, notok)
)
