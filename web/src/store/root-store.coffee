import Vuex from 'vuex'
import Vue from 'vue'
import sessionModule from './session-store'

Vue.use(Vuex)

export default =>
	new Vuex.Store(
		strict: process.env.NODE_ENV != 'production',
		state:
			appName: 'My App'
			loadingCounter: 0
			authenticateModal: false
			test: {}
		mutations:
			toggleAuthenticateModal: (state, show) ->
				state.authenticateModal = show
			setAppName: (state, appName) ->
				state.appName = appName
		actions:
			showAuthenticateModal: ({ commit }) ->
				commit('toggleAuthenticateModal', true)
			hideAuthenticateModal: ({ commit }) ->
				commit('toggleAuthenticateModal', false)
		modules:
			session: sessionModule
			# When adding here, see ssr docs. Global submodules *seem* to need a factory wrapper too
	)
