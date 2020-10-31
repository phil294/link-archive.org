import Vue from 'vue'
import axios from 'axios'

### todo docs
###
export default (...args) =>
	if typeof args[0] == 'string'
		resource_name = args[0]
	else
		{ resource_name, deserializer, endpoint } = args[0]
	custom = args[1]
	if not deserializer
		deserializer = (r) => r
	if not endpoint
		endpoint = resource_name
	resource_name_plural =
		if resource_name.match /y$/
			resource_name.slice(0, -1) + 'ies'
		else
			resource_name + 's'
	
	namespaced: custom.namespaced ? true
	state: -> {
		["#{resource_name_plural}_raw"]: []
		...(custom.state?())
	}
	getters: {
		[resource_name_plural]: (state) ->
			state["#{resource_name_plural}_raw"]
		["#{resource_name}_by_id"]: (state, getters) ->
			getters[resource_name_plural].reduce (all, r) =>
				all[r._id] = r
				all
			, {}
		...custom.getters
	}
	mutations: {
		["add_#{resource_name}_raw"]: (state, r) ->
			state["#{resource_name_plural}_raw"].unshift deserializer r
		["set_#{resource_name_plural}_raw"]: (state, rs) ->
			state["#{resource_name_plural}_raw"] = rs.map (r) => deserializer r
		["update_#{resource_name}_raw"]: (state, r) ->
			index = state["#{resource_name_plural}_raw"].findIndex (t) => t._id == r._id
			Vue.set state["#{resource_name_plural}_raw"], index, deserializer r
		["remove_#{resource_name}_raw"]: (state, r) ->
			index = state["#{resource_name_plural}_raw"].indexOf r
			state["#{resource_name_plural}_raw"].splice index, 1
		["remove_#{resource_name}_raw_by_id"]: (state, _id) ->
			index = state["#{resource_name_plural}_raw"].findIndex (t) => t._id == _id
			state["#{resource_name_plural}_raw"].splice index, 1
		["sort_#{resource_name_plural}_raw"]: (state, sort_by) ->
			if typeof sort_by == 'string'
				sorter = (a, b) =>
					a[sort_by].toString().localeCompare b[sort_by]
			else
				sorter = sort_by
			state["#{resource_name_plural}_raw"].sort(sorter)
		...custom.mutations
	},
	actions: {
		### send to server, upon response commit ###
		["add_#{resource_name}_raw"]: ({ commit }, r) ->
			response = await axios.post endpoint, r.form_data or r
			resource = response.data
			commit "add_#{resource_name}_raw", resource
			resource
		["get_#{resource_name_plural}_raw"]: ({ commit, state }, params) ->
			response = await axios.get endpoint, { params }
			commit "set_#{resource_name_plural}_raw", response.data
			response.data
		["get_#{resource_name}_raw"]: ({ commit }, id) ->
			response = await axios.get "#{endpoint}/#{id}"
			commit "add_#{resource_name}_raw", response.data
			response.data
		["update_#{resource_name}_raw"]: ({ commit }, r) ->
			response = await axios.put "#{endpoint}/#{r._id}", r.form_data or r
			commit "update_#{resource_name}_raw", response.data
			response.data
		["delete_#{resource_name}_raw"]: ({ dispatch }, r) ->
			if not await dispatch 'confirm_ask', "Do you really want to delete '#{r.name}'?", root: true
				return false
			dispatch "delete_#{resource_name}_raw_no_confirm", r
		["delete_#{resource_name}_raw_no_confirm"]: ({ dispatch, commit }, r) ->
			await axios.delete "#{endpoint}/#{r._id}"
			commit "remove_#{resource_name}_raw_by_id", r._id
		...custom.actions
	}