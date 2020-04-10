import { loadAsyncComponents } from '@akryum/vue-cli-plugin-ssr/client'
import './register-service-worker'
import { create_app } from './vue-app'
import { install_error_handler } from './error-handler'

create_app
	before_app: ({ router }) ->
		await loadAsyncComponents { router }

	after_app: ({ app, router, store }) ->
		install_error_handler { store, router }
		store.replaceState window.__INITIAL_STATE__
		router.onReady =>
			app.$mount '#app'
