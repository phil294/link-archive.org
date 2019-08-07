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
	store = create_store()
	router = create_router(store)
	sync store, router

	axios.defaults.baseURL = process.env.API_ROOT
	axios.interceptors.request.use config =>
		store.dispatch 'server_reachable'
		config.headers.common.Authorization = "Bearer #{store.state.session.token}"
		config
	axios.interceptors.response.use (response => response), error =>
		if error.response && error.response.status == 401
			store.dispatch 'session/logout'	
		else if error.response == undefined or error.code == 'ECONNABORTED'
			store.dispatch 'server_unreachable'
		formatted_error = # todo better not use axios then
			data: error.response && (error.response.data || error.response.statusText || '') || null
			status: error.response && error.response.status || 0
		console.error formatted_error
		Promise.reject(formatted_error)

	app = new Vue
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
			token = storage_service.get 'token'
			if token
				@$store.dispatch 'session/login_with_token', token
				@$store.dispatch 'session/refresh_token' # make sure the token is still valid by asking the server for a new one # this should probably be never-expiring and the email ones be shortlived instead TODO (or one-time?)
		render: h => h App
	{ app, router, store }
