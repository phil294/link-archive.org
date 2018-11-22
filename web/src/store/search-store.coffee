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
	Else, showers-columns extraAttributes are included in the returned view.
	If < 1, no extraAttributes will be added.

# Search result (answer)

Result contains product values at uniq([...showers, ...sorters, ...extraAttributes])
with showers = (`shower1`, `shower2`, ... `showerN`)
and extraAttributes = (`attribute1`, `attribute2`, ... `attributeM`)
where N >= 0 (client-defined) and M >= 0 (server-defined based on `columns`) but N+M >= 1 (columns >= 1). extraAttributes ⊈ showers.
extraAttributes are also shown attributes and in some sense showers, but not configured by the user. Their order matters.

Query response:
- `result`:
	`extraAttributes`: []
	`products`: []

In the frontend, the columns (attibutes) to be displayed are determined by
`relevantAttributes` = [...showers, ...sorterAttributesNotContainedInExtraAttributes, ...extraAttributes].
showers and sorters are known before the server responds, so only need to add extraAttributes to the end.
extraAttributes could instead be the first M elements of the global attributes array instead. But this is not ideal since that order may change. With the current system, changes are coherent. (Maybe add a check to compare both? Should in most cases stay the same. And if changed, debug info + rerquest new attributes?)

# Showers

It would be easiest to always request an editable set of `showers`¹. But result views will be shareable. Every request increments the interest on the passed filters/sorters/showers and thus, keeping showers should be avoided.
-> Make the user configure showers manually.
This way, the server is only queried with showers that the user actively set and incrementing the interest is justified.

# Example:

	Initial state:
	filters={}, sorters={}, showers=[] (, attributes=[a1, a2, ..., a50])

	Response:
	products=[...], extraAttributes: [a1, a2, a3, a4, a5]

	User sets 1 filter at a2, 1 sorter at a5 and configures showers=[a3, a1]
	filters={a2: 'bla'}, sorters={a5: 1}, showers=[a3, a1]

	Server query: SELECT showers, extraAttributes..., sorters FROM p WHERE filters ORDER BY sorters
	Response:
	products=[...], extraAttributes: [a2, a4, a5]

	Resulting table: relevantAttributes:
	[a3, a1, a2, a4, a5]
	[...showers, ...extraAttributes] with filters and sorters active.
	
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
- extraAttributes
- relevantAttributes
- availableAttributes

###
export default
	namespaced: true
	state:
		product: 'test'
		# while dev: stub attrs
		attributes: [0..10].map((i) =>
			id: i
			name: "attribute #{i}"
		)
		filters: null
		sorters: [
				attribute: 2 # todo call this attributeId
				direction: 1
			,
				attribute: 3
				direction: -1
		]
		showerIds: [5, 6]
		columns: null
		products: []
		extraAttributeIds: []
	getters:
		attributesById: state ->
			state.attributes.reduce((all, attribute) =>
				all[attribute.id] = attribute
				return all
			, {})
		sortersByAttributeId: state ->
			state.attributes.reduce((all, attribute) =>
				sorterIndex = state.sorters.findIndex(sorter => sorter.attribute == attribute.id)
				if sorterIndex > -1
					all[attribute.id] =
						index: sorterIndex
						direction: state.sorters[sorterIndex].direction
				else
					all[attribute.id] = {}
				return all
			, {})
		sortersAmount: state -> state.sorters.length
		### This is a concatenation of showers and extraAttributes (and sorters in between, if not contained in the latter) ###
		relevantAttributeIds: (state, getters) ->
			# sorters that are not part of extraAttributes or showers
			sorters = state.sorters
				.map(sorter => sorter.attribute)
				.filter(attributeId =>
					!state.extraAttributeIds.includes(attributeId) &&
					!state.showerIds.includes(attributeId))
			return [
				...state.showerIds,
				...sorters,
				...state.extraAttributeIds ]
		availableAttributeIds: (state, getters) ->
			relevants = getters.relevantAttributeIds
			return state.attributes
				.map(attribute => attribute.id)
				.filter(attributeId =>
					!relevants.includes(attributeId))
	mutations:
		removeSorterAt: (state, index) -> Vue.delete(state.sorters, index)
		addSorter: (state, sorter) -> state.sorters.push(sorter)
		setProducts: (state, products) -> state.products = products
		setExtraAttributeIds: (state, extraAttributeIds) -> state.extraAttributeIds = extraAttributeIds
		removeShowerIdAt: (state, index) -> Vue.delete(state.showerIds, index)
		addShowerIdAt: (state, { index, showerId }) -> state.showerIds.splice(index, 0, showerId)
	actions:
		toggleSortDirection: ({ commit, state, getters }, { attributeId, direction }) ->
			sorter = getters.sortersByAttributeId[attributeId]
			if sorter
				commit('removeSorterAt', sorter.index)
				if sorter.direction == direction
					return
			commit('addSorter', { attribute: attributeId, direction })
		search: ({ commit, state }) ->
			if state.result
				return
			response = await axios.get("p/#{state.product}") # columns=...
			commit('setExtraAttributeIds', response.data.extraAttributeIds)
			commit('setProducts', response.data.products)
		addShowerAt: ({ dispatch, commit, state }, { index, showerId }) ->
			currentPos = state.showerIds.findIndex(e => e == showerId)
			if currentPos == index
				return # nothing changed
			if currentPos > -1
				commit('removeShowerIdAt', currentPos) # user moved shower from pos A to B
			commit('addShowerIdAt', { index, showerId })
			commit('setExtraAttributeIds', [])
			dispatch('search')