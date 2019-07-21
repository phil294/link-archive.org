import storage_service from '@/services/storage-service'
import axios from 'axios'
import Vue from 'vue'

###
# Search request

A search request consists out of user-defined request modifiers:
- `subject`: string
	What to search for
- `filters`: {} - optional
	Attributes to filter by
- `sorters`: {} - optional
	Attributes to sort with
- `showers`: [] - optional
	Attributes to be included in the result product data: [`shower1`, `shower2`, ... `showerN`]
	Each product data result will include max(N, columns) entries.
	Showers are what the server sent, and may be configured by the user (add / remove / move cols around, maybe in order to sort / filter by them or jff)
- `columns`: number
	Amount of attributes to respond with. If <= showers, ignored.
	If < 1, no values will be returned

# Search result (answer)

Result contains product values at [...showers]. filters and sorters are part of showers, defined seperately.
with showers = (`shower1`, `shower2`, ... `showerN`)

Query response:
- `result`:
	`showers`: []
	`products`: []

In the frontend, the columns (attibutes) to be displayed are determined by
`showers`

---
Seperate query:
- attributes: []
	All attributes there are (maybe make this dynamic one day for when there are a lot of them)

overview to avoid duplicate lists:

- filters, sorters, showers
- sorters_by_attribute
- sorters_amount

- attributes
- attributes_by_id
- hidden_attributes

attributes = showers + hidden

###
export default
	namespaced: true
	state: =>
		### static ###
		#
		### (optionally) user-defined ###
		subject: 'test'
		filters: [
		]
		shower_ids: []
		sorters: [
		]
		columns: 5
		### server response; readonly ###
		attributes: []
		products: []
	getters:
		attribute_ids: state ->
			state.attributes.map a => a._id # todo add map('str') prototype
		attributes_by_id: state ->
			state.attributes.reduce((all, attribute) =>
				all[attribute._id] = attribute
				all
			, {})
		sorters_by_attribute_id: (state, getters) ->
			getters.attribute_ids.reduce((all, attribute_id) =>
				sorter_index = state.sorters.findIndex(sorter => sorter.attribute_id == attribute_id)
				if sorter_index > -1
					all[attribute_id] =
						index: sorter_index
						direction: state.sorters[sorter_index].direction
				else
					all[attribute_id] = {}
				all
			, {})
		filters_by_attribute_id: (state, getters) ->
			getters.attribute_ids.reduce((all, attribute_id) =>
				all[attribute_id] = state.filters.filter filter => filter.attribute_id == attribute_id
				all
			, {})
		sorters_amount: state -> state.sorters.length
		# todo docs belong here not top
		hidden_attribute_ids: (state, getters) ->
			getters.attribute_ids
				.filter attribute_id =>
					!state.showers.includes attribute_id
	mutations:
		remove_sorter_at: (state, index) -> Vue.delete state.sorters, index
		add_sorter: (state, sorter) -> state.sorters.push sorter
		set_products: (state, products) -> state.products = products
		add_product: (state, product) -> state.products.push product
		add_product_datum: (state, { product, attribute_id, datum }) ->
			Vue.set product.data, attribute_id, datum
		set_shower_ids: (state, shower_ids) -> state.shower_ids = shower_ids
		remove_shower_id_at: (state, index) -> Vue.delete state.shower_ids, index
		remove_shower_id: (state, shower_id) -> Vue.delete state.shower_ids, state.shower_ids.indexOf(shower_id) # todo add prototy .remove method
		add_shower_id_at: (state, { index, shower_id }) -> state.shower_ids.splice index, 0, shower_id # todo ^
		set_attributes: (state, attributes) ->
			state.attributes = attributes
		add_filter: (state, filter) -> state.filters.push filter
		remove_filter: (state, filter) -> Vue.delete state.filters, state.filters.indexOf(filter)
	actions:
		toggle_sort_direction: ({ commit, dispatch, state, getters }, { attribute_id, direction }) ->
			sorter = getters.sorters_by_attribute_id[attribute_id]
			if sorter
				commit 'remove_sorter_at', sorter.index
				if sorter.direction == direction
					return dispatch 'search'
			commit 'add_sorter', { attribute_id, direction }
			dispatch 'search'
		### aka get_products ### # todo rename
		search: ({ commit, state }) ->
			# commit('set_shower_ids', [])
			commit 'set_products', []
			{ subject, columns } = state
			shower_ids_param = state.shower_ids
				.join ','
			sorters_param = state.sorters
				.map sorter => "#{sorter.attribute_id}:#{sorter.direction}"
				.join ','
			filters_param = state.filters
				.map filter => "#{filter.attribute_id}:#{filter.condition}:#{filter.condition_value}"
				.join ','
			response = await axios.get 'p',
				params:
					t: subject,
					sh: shower_ids_param,
					f: filters_param,
					so: sorters_param,
					c: columns
			commit 'set_shower_ids', response.data.shower_ids
			commit 'set_products', response.data.products
		move_shower_to: ({ dispatch, commit, state }, { index, shower_id }) ->
			current_pos = state.shower_ids.findIndex e => e == shower_id
			new_pos = index
			if current_pos > -1
				commit 'remove_shower_id_at', current_pos # user moved shower from pos A to B
				if index > current_pos
					new_pos -= 1
			commit 'add_shower_id_at', { index: new_pos, shower_id }
			if new_pos != current_pos
				dispatch 'search'
		remove_shower: ({ commit, getters, dispatch }, shower_id ) ->
			search = false
			attribute_filters = getters.filters_by_attribute_id[shower_id]
			if attribute_filters.length
				if !confirm "There are #{attribute_filters.length} filter(s) configured for '#{getters.attributes_by_id[shower_id].name}' that will be removed. Continue?"
					return
				for filter from attribute_filters
					commit 'remove_filter', filter
				search = true
			attribute_sorter = getters.sorters_by_attribute_id[shower_id]
			if attribute_sorter.direction
				commit 'remove_sorter_at', attribute_sorter.index
				search = true
			commit 'remove_shower_id', shower_id
			if search
				dispatch 'search'
		add_product: ({ commit, state }, { form_data }) ->
			form_data.append 'subject', state.subject
			response = await axios.post 'p', form_data
			commit 'add_product', response.data
		save_datum: ({ commit, state }, { product, attribute_id, form_data }) ->
			response = await axios.post "p/#{product._id}/data/#{attribute_id}", form_data
			commit 'add_product_datum', { product, attribute_id, datum: response.data }
		get_attributes: ({ commit, state }) ->
			response = await axios.get 'a', { params: { t: state.subject } }
			commit 'set_attributes', response.data
		add_filter: ({ commit, dispatch }, { values }) -> # todo formdata?
			commit 'add_filter', values
			dispatch 'search'
		remove_filter: ({ commit, dispatch }, filter) ->
			commit 'remove_filter', filter
			dispatch 'search'