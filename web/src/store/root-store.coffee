import Vuex from 'vuex'
import Vue from 'vue'
import session_module from './session-store'

Vue.use(Vuex)

export default =>
	new Vuex.Store(
		strict: process.env.NODE_ENV != 'production',
		state:
			app_name: 'My App'
			loading_counter: 0
			authenticate_popup: false
			test: {}
		mutations:
			toggle_authenticate_popup: (state, show) ->
				state.authenticate_popup = show
			set_app_name: (state, app_name) ->
				state.app_name = app_name
			increase_loading_counter: state ->
				state.loading_counter++
			decrease_loading_counter: state ->
				state.loading_counter--
		actions:
			show_authenticate_popup: ({ commit }) ->
				commit('toggle_authenticate_popup', true)
			hide_authenticate_popup: ({ commit }) ->
				commit('toggle_authenticate_popup', false)
		modules:
			session: session_module
			# When adding here, see ssr docs. Global submodules *seem* to need a factory wrapper too
	)
