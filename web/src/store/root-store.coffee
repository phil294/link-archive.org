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
			authenticatePopup: false
			test: {}
		mutations:
			toggleAuthenticatePopup: (state, show) ->
				state.authenticatePopup = show
			setAppName: (state, appName) ->
				state.appName = appName
			increaseLoadingCounter: (state) ->
				state.loadingCounter++
			decreaseLoadingCounter: (state) ->
				state.loadingCounter--
		actions:
			showAuthenticatePopup: ({ commit }) ->
				commit('toggleAuthenticatePopup', true)
			hideAuthenticatePopup: ({ commit }) ->
				commit('toggleAuthenticatePopup', false)
		modules:
			session: sessionModule
			# When adding here, see ssr docs. Global submodules *seem* to need a factory wrapper too
	)
