import storageService from '@/services/storage-service'
import axios from 'axios'
import Vue from 'vue'

###
# Search request

A search request consists out of user-defined request modifiers:
- `type`: string
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
- sortersByAttribute
- sortersAmount

- attributes
- attributesById
- hiddenAttributes

attributes = showers + hidden

###
export default
	namespaced: true
	state:
		### static ###
		#
		### (optionally) user-defined ###
		type: 'test'
		filters: [
		]
		showerIds: []
		sorters: [
		]
		columns: 5
		### server response; readonly ###
		attributes: []
		products: []
	getters:
		attributeIds: state ->
			state.attributes.map(a => a._id)
		attributesById: state ->
			state.attributes.reduce((all, attribute) =>
				all[attribute._id] = attribute
				all
			, {})
		sortersByAttributeId: (state, getters) ->
			getters.attributeIds.reduce((all, attributeId) =>
				sorterIndex = state.sorters.findIndex(sorter => sorter.attributeId == attributeId)
				if sorterIndex > -1
					all[attributeId] =
						index: sorterIndex
						direction: state.sorters[sorterIndex].direction
				else
					all[attributeId] = {}
				all
			, {})
		filtersByAttributeId: (state, getters) ->
			getters.attributeIds.reduce((all, attributeId) =>
				all[attributeId] = state.filters.filter(filter => filter.attributeId == attributeId)
				all
			, {})
		sortersAmount: state -> state.sorters.length
		hiddenAttributeIds: (state, getters) ->
			getters.attributeIds
				.filter(attributeId =>
					!state.showers.includes(attributeId))
	mutations:
		removeSorterAt: (state, index) -> Vue.delete(state.sorters, index)
		addSorter: (state, sorter) -> state.sorters.push(sorter)
		setProducts: (state, products) -> state.products = products
		addProduct: (state, product) -> state.products.push(product)
		addProductDatum: (state, { product, attributeId, datum }) ->
			Vue.set(product.data, attributeId, datum)
		setShowerIds: (state, showerIds) -> state.showerIds = showerIds
		removeShowerIdAt: (state, index) -> Vue.delete(state.showerIds, index)
		removeShowerId: (state, showerId) -> Vue.delete(state.showerIds, state.showerIds.indexOf(showerId)) # todo add prototy .remove method
		addShowerIdAt: (state, { index, showerId }) -> state.showerIds.splice(index, 0, showerId)
		setAttributes: (state, attributes) ->
			state.attributes = attributes
		addFilter: (state, filter) -> state.filters.push(filter)
		removeFilter: (state, filter) -> Vue.delete(state.filters, state.filters.indexOf(filter))
	actions:
		toggleSortDirection: ({ commit, dispatch, state, getters }, { attributeId, direction }) ->
			sorter = getters.sortersByAttributeId[attributeId]
			if sorter
				commit('removeSorterAt', sorter.index)
				if sorter.direction == direction
					return dispatch('search')
			commit('addSorter', { attributeId, direction })
			dispatch('search')
		### aka getProducts ###
		search: ({ commit, state }) ->
			# commit('setShowerIds', [])
			commit('setProducts', [])
			{ type, columns } = state
			showerIdsParam = state.showerIds
				.join(',')
			sortersParam = state.sorters
				.map(sorter => "#{sorter.attributeId}:#{sorter.direction}")
				.join(',')
			filtersParam = state.filters
				.map(filter => "#{filter.attributeId}:#{filter.condition}:#{filter.conditionValue}")
				.join(',')
			response = await axios.get('p', { params: {
				t: type,
				sh: showerIdsParam,
				f: filtersParam,
				so: sortersParam,
				c: columns
			} })
			commit('setShowerIds', response.data.showerIds)
			commit('setProducts', response.data.products)
		moveShowerTo: ({ dispatch, commit, state }, { index, showerId }) ->
			currentPos = state.showerIds.findIndex(e => e == showerId)
			newPos = index
			if currentPos > -1
				commit('removeShowerIdAt', currentPos) # user moved shower from pos A to B
				if index > currentPos
					newPos -= 1
			commit('addShowerIdAt', { index: newPos, showerId })
			if newPos != currentPos
				dispatch('search')
		removeShower: ({ commit, getters, dispatch }, showerId) ->
			search = false
			attributeFilters = getters.filtersByAttributeId[showerId]
			if attributeFilters.length
				if !confirm("There are #{attributeFilters.length} filter(s) configured for '#{getters.attributesById[showerId].name}' that will be removed. Continue?")
					return
				for filter from attributeFilters
					commit('removeFilter', filter)
				search = true
			attributeSorter = getters.sortersByAttributeId[showerId]
			if attributeSorter.direction
				commit('removeSorterAt', attributeSorter.index)
				search = true
			commit('removeShowerId', showerId)
			if search
				dispatch('search')
		addProduct: ({ commit, state }, { formData }) ->
			formData.append('type', state.type)
			response = await axios.post('p', formData)
			commit('addProduct', response.data)
		saveDatum: ({ commit, state }, { product, attributeId, formData }) ->
			response = await axios.post("p/#{product._id}/data/#{attributeId}", formData)
			commit('addProductDatum', { product, attributeId, datum: response.data })
		getAttributes: ({ commit, state }) ->
			response = await axios.get('a', { params: { t: state.type } })
			commit('setAttributes', response.data)
		addFilter: ({ commit, dispatch }, { values }) ->
			commit('addFilter', values)
			dispatch('search')
		removeFilter: ({ commit, dispatch }, filter) ->
			commit('removeFilter', filter)
			dispatch('search')