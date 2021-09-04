import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import { install_error_handler } from './error-handler'
import create_router from './vue-router.coffee'
import create_store from './store/root-store.coffee'
import http from './services/http.coffee'
import drag from './directives/drag.coffee'
import drop from './directives/drop.coffee'
import filedrop from './directives/filedrop.coffee'
import moveable from './directives/moveable.coffee'
import dragscrollable from './directives/dragscrollable.coffee'
import VueObserveVisibility from 'vue-observe-visibility'
import AutoexpandingTextarea from '@/components/AutoexpandingTextarea.vue'
import FilterSelect from '@/components/FilterSelect.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import Modal from '@/components/Modal.vue'
import MultiSelect from '@/components/MultiSelect.vue'
import Popup from '@/components/Popup.vue'
import PromiseButton from '@/components/PromiseButton.vue'
import PromiseForm from '@/components/PromiseForm.vue'
import ReadMore from '@/components/ReadMore.vue'
import FormField from '@/components/FormField.vue'
import './register-service-worker.js'
import utils from './utils.coffee'

window._dayjs = dayjs
window.utils = utils

store = create_store()
router = create_router(store)
$http = http store

app = createApp App

install_error_handler { app, store, router }

app.use router
app.use store
app.config.globalProperties.utils = utils

app.component 'autoexpanding-textarea', AutoexpandingTextarea
app.component 'filter-select', FilterSelect
app.component 'loading-button', LoadingButton
app.component 'modal', Modal
app.component 'multi-select', MultiSelect
app.component 'popup', Popup
app.component 'promise-button', PromiseButton
app.component 'promise-form', PromiseForm
app.component 'read-more', ReadMore
app.component 'form-field', FormField

# app.use VueObserveVisibility
# https://github.com/Akryum/vue-observe-visibility/issues/219#issuecomment-683460059
# Fix when released for vue 3
# FIXME: check if this workaround actually works
app.directive 'observe-visibility',
	beforeMount: VueObserveVisibility.beforeMount
	update: VueObserveVisibility.update
	unmounted: VueObserveVisibility.unbind

app.directive 'drag', drag
app.directive 'drop', drop
app.directive 'filedrop', filedrop
app.directive 'moveable', moveable
app.directive 'dragscrollable', dragscrollable

do =>
	await store.dispatch 'session/initialize'
	await router.isReady()
	app.mount('#app')

export { app, router, store, $http }
