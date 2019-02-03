import create_app from './vue-app'

export default (context) => new Promise((ok, notok) =>
	{ app, router, store } = create_app()
	router.push(context.url)
	router.onReady( =>
		matched_components = router.getMatchedComponents()
		if !matched_components.length
			return notok({ code: 404 })
		Promise.all(matched_components.map(Component =>
			# todo crash here does not send res answer but hangs
			async_data_hook = Component.async_data_hook || (Component.options || {}).async_data_hook
			if async_data_hook
				return Component.options.async_data_hook(
					store: store
					route: router.currentRoute)
		)).then( =>
			context.state = store.state # eslint-disable-line no-param-reassign
			ok(app)
		).catch(notok)
	, notok)
)