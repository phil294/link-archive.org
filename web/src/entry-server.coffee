import { create_app } from './vue-app'

prepare_url_for_routing = (url) =>
	{ BASE_URL } = process.env
	if url.startsWith(BASE_URL.replace(/\/$/, ''))
		url.substr BASE_URL.length
	else
		url

export default (context) =>
	new Promise (resolve, reject) =>
		{ app, router, store } = await create_app()

		router.push(prepare_url_for_routing(context.url))

		router.onReady =>
			context.rendered = =>
				# After all preFetch hooks are resolved, our store is now
				# filled with the state needed to render the app.
				# When we attach the state to the context, and the `template` option
				# is used for the renderer, the state will automatically be
				# serialized and injected into the HTML as `window.__INITIAL_STATE__`.
				context.state = store.state
			resolve app
		, reject