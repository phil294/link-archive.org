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
			store_history: []
			max_store_history_size: if process.env.NODE_ENV == 'production' then 10 else 100
			loading_counter: 0
			authenticate_popup: false
			global_error_message: ''
			default_focus_target: null
			confirm_prompt: ''
		mutations:
			toggle_authenticate_popup: (state, show) ->
				state.authenticate_popup = show
			push_store_history: (state, item) ->
				try
					item = JSON.stringify(item, null, 2)
				catch e
					debugger
					return
				if item == state.store_history[state.store_history.length-1]
					return
				state.store_history.push item
				if state.store_history.length > state.max_store_history_size
					state.store_history.shift()
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
	store.subscribe (mutation) =>
		if mutation.type != 'push_store_history' and
				not ['token', 'loading_counter', 'route'].some((match) => mutation.type.includes match) and
				not Object.keys(mutation.payload or {}).some((key) => key.match(/token/i))
			if Array.isArray mutation.payload
				mutation.payload = "Array[#{mutation.payload.length}]"
			store.commit 'push_store_history', mutation
	store.subscribeAction (action) =>
		store.commit 'push_store_history', action.type
	
	store
