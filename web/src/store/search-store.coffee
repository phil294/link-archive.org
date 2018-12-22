import storageService from '@/services/storage-service'
import axios from 'axios'
import Vue from 'vue'

###
# Search request

A search request consists out of user-defined request modifiers:
- `product`: string
	What to search for
- `filters`: {} - optional
	Attributes to filter by
- `sorters`: {} - optional
	Attributes to sort with
- `showers`: [] - optional
	Attributes to assuredly include in the query: [`shower1`, `shower2`, ... `showerN`]
	Result will include N or more entries.
- `columns`: number
	Amount of attributes to respond with. If <= showers, ignored.
	Else, showers-columns extras are included in the returned view.
	If < 1, no extras will be added.

# Search result (answer)

Result contains product values at uniq([...showers, ...sorters, ...extras])
with showers = (`shower1`, `shower2`, ... `showerN`)
and extras = (`attribute1`, `attribute2`, ... `attributeM`)
where N >= 0 (client-defined) and M >= 0 (server-defined based on `columns`) but N+M >= 1 (columns >= 1). extras ⊈ showers.
extras are also shown attributes and in some sense showers, but not configured by the user. Their order matters.

Query response:
- `result`:
	`extras`: []
	`products`: []

In the frontend, the columns (attibutes) to be displayed are determined by
`relevantAttributes` = [...showers, ...sorterAttributesNotContainedInExtras, ...extras].
showers and sorters are known before the server responds, so only need to add extras to the end.
extras could instead be the first M elements of the global attributes array instead. But this is not ideal since that order may change. With the current system, changes are coherent. (Maybe add a check to compare both? Should in most cases stay the same. And if changed, debug info + rerquest new attributes?)

# Showers

It would be easiest to always request an editable set of `showers`¹. But result views will be shareable. Every request increments the interest on the passed filters/sorters/showers and thus, keeping showers should be avoided.
-> Make the user configure showers manually.
This way, the server is only queried with showers that the user actively set and incrementing the interest is justified.

# Example:

	Initial state:
	filters={}, sorters={}, showers=[] (, attributes=[a1, a2, ..., a50])

	Response:
	products=[...], extras: [a1, a2, a3, a4, a5]

	User sets 1 filter at a2, 1 sorter at a5 and configures showers=[a3, a1]
	filters=[{attributeId:'a2', condition: 'equals', conditionValue: 'bla'}], sorters=[{attributeId: 'a5', direction: 1}], showers=[a3, a1]

	Server query: SELECT showers, extras..., sorters FROM p WHERE filters ORDER BY sorters
	Response:
	products=[...], extras: [a2, a4, a5]

	Resulting table: relevantAttributes:
	[a3, a1, a2, a4, a5]
	which is [...showers, ...extras] with filters and sorters active.
	
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
- extras
- relevantAttributes
- availableAttributes

###
export default
	namespaced: true
	state:
		### static ###
		#
		### (optionally) user-defined ###
		type: 'test'
		filters: [
			attributeId: 'facebeefbadefaceaffeb003'
			condition: 'notNull'
			conditionValue: '2'
		]
		showerIds: ['facebeefbadefaceaffeb003', 'facebeefbadefaceaffeb004']
		sorters: [
				attributeId: 'facebeefbadefaceaffeb006'
				direction: 1
			,
				attributeId: 'facebeefbadefaceaffeb007'
				direction: -1
		]
		columns: 7
		### server response; readonly ###
		attributes: []
		products: []
		extraIds: []
	getters:
		attributesById: state ->
			state.attributes.reduce((all, attribute) =>
				all[attribute._id] = attribute
				all
			, {})
		sortersByAttributeId: state ->
			state.attributes.reduce((all, attribute) =>
				sorterIndex = state.sorters.findIndex(sorter => sorter.attributeId == attribute._id)
				if sorterIndex > -1
					all[attribute._id] =
						index: sorterIndex
						direction: state.sorters[sorterIndex].direction
				else
					all[attribute._id] = {}
				all
			, {})
		sortersAmount: state -> state.sorters.length
		### This is a concatenation of showers and extras (and sorters in between, if not contained in the latter) ###
		relevantAttributeIds: (state, getters) ->
			# sorters that are not part of extras or showers # todo rename
			sorters = state.sorters
				.map(sorter => sorter.attributeId)
				.filter(attributeId =>
					!state.extraIds.includes(attributeId) &&
					!state.showerIds.includes(attributeId))
			[	...state.showerIds,
				...sorters,
				...state.extraIds ]
		availableAttributeIds: (state, getters) ->
			relevants = getters.relevantAttributeIds
			state.attributes
				.map(attribute => attribute._id)
				.filter(attributeId =>
					!relevants.includes(attributeId))
	mutations:
		removeSorterAt: (state, index) -> Vue.delete(state.sorters, index)
		addSorter: (state, sorter) -> state.sorters.push(sorter)
		setProducts: (state, products) -> state.products = products
		addProduct: (state, product) -> state.products.push(product)
		addProductDatum: (state, { product, attributeId, datum }) ->
			Vue.set(product.data, attributeId, datum)
		setExtraIds: (state, extraIds) -> state.extraIds = extraIds
		removeShowerIdAt: (state, index) -> Vue.delete(state.showerIds, index)
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
					return # todo seach nonetheless
			commit('addSorter', { attributeId, direction })
			dispatch('search')
		### aka getProducts ###
		search: ({ commit, state }) ->
			commit('setExtraIds', [])
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
			commit('setExtraIds', response.data.extraIds)
			commit('setProducts', response.data.products)
		addShowerAt: ({ dispatch, commit, state }, { index, showerId }) ->
			currentPos = state.showerIds.findIndex(e => e == showerId)
			newPos = index
			if currentPos > -1
				commit('removeShowerIdAt', currentPos) # user moved shower from pos A to B
				if index > currentPos
					newPos -= 1
			commit('addShowerIdAt', { index: newPos, showerId })
			if newPos != currentPos
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
		addFilter: ({ commit, dispatch }, filter) ->
			commit('addFilter', filter)
			dispatch('search')
		removeFilter: ({ commit, dispatch }, filter) ->
			commit('removeFilter', filter)
			dispatch('search')