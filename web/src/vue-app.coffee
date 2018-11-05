import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import App from './App'
import createRouter from './vue-router'
import createStore from './store/root-store'
import storageService from '@/services/storage-service'

Vue.config.productionTip = false

export default ->
	router = createRouter()
	store = createStore()
	sync(store, router)

	axios.defaults.baseURL = process.env.API_ROOT
	axios.interceptors.request.use((config) =>
		config.headers.common.Authorization = "Bearer #{store.state.session.token}"
		config)

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
			token = storageService.getToken()
			if token
				@$store.dispatch('session/loginWithToken', token)
		render: (h) => h(App)
	)
	{ app, router, store }
