import Vue from 'vue'
import Vuex from 'vuex'
import session_module from './session-store'

Vue.use Vuex

confirm_resolve = null

export create_store = =>
	new Vuex.Store
		# strict: process.env.NODE_ENV != 'production' # TODO: https://github.com/Akryum/vue-cli-plugin-ssr/issues/184
		state: ->
			app_name: 'MEVN App name'
			app_version: process.env.VUE_APP_APP_VERSION
			loading_counter: 0
			authenticate_popup: false
			global_error_message: ''
			default_focus_target: null
			confirm_prompt: ''
		mutations:
			toggle_authenticate_popup: (state, show) ->
				state.authenticate_popup = show
			set_app_name: (state, app_name) ->
				state.app_name = app_name
			increase_loading_counter: (state) ->
				state.loading_counter++
			decrease_loading_counter: (state) ->
				state.loading_counter--
			set_global_error_message: (state, msg) ->
				state.global_error_message = msg
			set_confirm_prompt: (state, prompt) ->
				state.confirm_prompt = prompt
			set_default_focus_target: (state, el) ->
				state.default_focus_target = el
		actions:
			show_authenticate_popup: ({ commit }) ->
				commit 'toggle_authenticate_popup', true
			hide_authenticate_popup: ({ commit }) ->
				commit 'toggle_authenticate_popup', false
			server_unreachable: ({ commit }) ->
				commit 'set_global_error_message', 'Server unreachable!'
			server_reachable: ({ commit }) ->
				commit 'set_global_error_message', ''
			set_global_error_message: ({ commit }, msg) ->
				commit 'set_global_error_message', msg
			reset_global_error_message: ({ commit }) ->
				commit 'set_global_error_message', ''
			confirm_ask: ({ commit }, prompt) ->
				commit 'set_confirm_prompt', prompt
				new Promise (ok) =>
					confirm_resolve = ok
			confirm_answer: ({ commit }, answer) ->
				confirm_resolve answer
				commit 'set_confirm_prompt', ''
			set_default_focus_target: ({ commit }, el) ->
				commit 'set_default_focus_target', el
			offer_focus: ({ state }) ->
				if state.default_focus_target
					state.default_focus_target.focus(preventScroll: true)
		modules:
			session: session_module
			# When adding here, see ssr docs. Global submodules *seem* to need a factory wrapper too