import Vue from 'vue'
import axios from 'axios'
import App from './App'
import { create_router } from './vue-router'
import { create_store } from './store/root-store'
import storage_service from '@/services/storage-service'
import './directives/drag'
import './directives/drop'
import './directives/filedrop'
import './directives/moveable'
import './directives/dragscrollable'
import AutoexpandingTextarea from '@/components/AutoexpandingTextarea'
import FilterSelect from '@/components/FilterSelect'
import LoadingButton from '@/components/LoadingButton'
import Modal from '@/components/Modal'
import MultiSelect from '@/components/MultiSelect'
import Popup from '@/components/Popup'
import PromiseButton from '@/components/PromiseButton'
import PromiseForm from '@/components/PromiseForm'
import ReadMore from '@/components/ReadMore'

Vue.config.productionTip = false

# For some global window declarations, see App.vue

Vue.component 'autoexpanding-textarea', AutoexpandingTextarea
Vue.component 'filter-select', FilterSelect
Vue.component 'loading-button', LoadingButton
Vue.component 'modal', Modal
Vue.component 'multi-select', MultiSelect
Vue.component 'popup', Popup
Vue.component 'promise-button', PromiseButton
Vue.component 'promise-form', PromiseForm
Vue.component 'read-more', ReadMore

export create_app = ({ before_app = =>, after_app = => } = {}) ->
	store = create_store()
	router = create_router(store)
	
	await before_app { router, store }

	axios.defaults.baseURL = process.env.VUE_APP_API_ROOT
	axios.interceptors.request.use (config) =>
		store.dispatch 'server_reachable'
		token = store.state.session.token
		if token
			config.headers.common.Authorization = "Bearer #{token}"
		config
	axios.interceptors.response.use ((response) => response), (error) =>
		formatted_error =
			data: error.response && (error.response.data || error.response.statusText || '') || null
			status: error.response && error.response.status || 0
		# Not sure if this would ever be possible
		if (error.response == undefined or error.code == 'ECONNABORTED') and formatted_error.status != 0
			formatted_error.status = 0
		Promise.reject(formatted_error)

	app = new Vue {
		router
		store
		render: (h) => h(App)
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
	}

	result = { app, router, store }

	await after_app result

	result