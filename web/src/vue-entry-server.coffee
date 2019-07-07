import create_app from './vue-app'

export default context => new Promise (ok, notok) =>
	{ app, router, store } = create_app()
	router.push context.url
	router.onReady =>
		context.rendered = =>
			context.state = store.state
		ok(app)
	, notok