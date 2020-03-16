import { loadAsyncComponents } from '@akryum/vue-cli-plugin-ssr/client'
import './register-service-worker'
import { create_app } from './vue-app'

create_app
	before_app: ({ router }) ->
		await loadAsyncComponents { router }

	after_app: ({ app, router, store }) ->
		store.replaceState window.__INITIAL_STATE__
		router.onReady =>
			app.$mount '#app'
