import Vue from 'vue'
import dayjs from 'dayjs'
import Vuex from 'vuex'
import session_module from './session-store.coffee'

Vue.use Vuex

confirm_resolve = (_) =>

export create_store = =>
	store = new Vuex.Store
		strict: true
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
				item = dayjs().format('YYYY-MM-DD HH:mm:ss ') + item
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
	store.subscribe ({ type, payload }) =>
		if not payload
			payload = {}
		if type != 'push_store_history' and
				not ['loading_counter', 'route', 'error'].some((match) => type.includes match)
			if ['token'].some((match) => type.includes match) or
					Object.keys(payload).some((key) => key.match(/token/i))
				payload = "[...]"
			else if Array.isArray payload
				payload = "Array[#{payload.length}]"
			else if typeof payload == 'object'
				payload = Object.fromEntries(Object.entries(payload)
					.map ([k, v]) =>
						v =
							if k.match /_ref$/
								'[...]'
							else if Array.isArray v
								"Array[#{v.length}]"
							else if typeof v == 'object'
								'{...}'
							else
								v
						[ k, v ])
			store.commit 'push_store_history', { type, payload }
	store.subscribeAction (action) =>
		store.commit 'push_store_history', action.type
	
	store
