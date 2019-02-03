import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import App from './App'
import create_router from './vue-router'
import create_store from './store/root-store'
import storage_service from '@/services/storage-service'
import './directives/drag'
import './directives/drop'

Vue.config.productionTip = false

export default ->
	router = create_router()
	store = create_store()
	sync(store, router)

	axios.defaults.baseURL = process.env.API_ROOT
	axios.interceptors.request.use(config =>
		config.headers.common.Authorization = "Bearer #{store.state.session.token}"
		config)
	axios.interceptors.response.use((response => response), error =>
		console.error(error.response)
		Promise.reject(error.response && (error.response.data || error.response.statusText || error.response.status) || error.response || error))

	app = new Vue(
		router: router
		store: store
		beforeMount: ->
			await @$nextTick()
			### ************* CLIENT-ONLY DOM MODIFICATION ***************
			 * Needs to happen after $nextTick so the ssr hydration
			 * check does not consider the below changes. In other words,
			 * the lines below may make the page look different than
			 * what the server-side rendered html looks like.
			 * Right now, this only includes session data (setting jwt)
			 * which is not part of ssr (client-only, for API
			 * interaction)
			###
			token = storage_service.get('token')
			if token
				@$store.dispatch('session/login_with_token', token)
		render: h => h(App)
	)
	{ app, router, store }
