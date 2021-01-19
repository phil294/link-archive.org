import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App'
import { install_error_handler } from './error-handler'
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
import './register-service-worker'

Vue.config.productionTip = false

Vue.use VueMeta

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

export default ->
	store = create_store()
	router = create_router(store)
	
	new Vue {
		router
		store
		render: (h) => h App
		beforeMount: ->
			window.sleep = (ms) => new Promise (ok) => setTimeout(ok, ms)
			install_error_handler { store, router }
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
