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
	Attributes to include in the query. This is the required result attribute order, indices [`0`: `shower1`, `1`: `shower2`, ... `N`: `showerN`].
	Defined by moving table columns around.
	Result will include N or more entries.
- `columns`: number
	Amount of attributes to respond with. If <= showers, ignored. Else, showers-columns extraAttributes are included.

# Search result (answer)

Result contains product values at [...showers, ...extraAttributes]
with showers = (`shower1`, `shower2`, ... `showerN`)
and extraAttributes = (`attribute1`, `attribute2`, ... `attributeM`)
where N >= 0 (client-defined) and M >= 0 (server-defined based on `columns`) but N+M >= 1 (columns >= 1). extraAttributes ⊈ showers.
extraAttributes are also shown attributes and in some sense showers, but not configured by the user.

Query response:
- `result`:
	`extraAttributes`: []
	`products`: []

# Showers

It would be easiest to always request an editable set of `showers`¹. But result views will be shareable. Every request increments the interest on the passed filters/sorters/showers and thus, keeping showers should be avoided.
-> Determine showers dynamically: Cut extraAttributes from the end of a new column ordering² => showers for request. New showers are added at the very left.
This way, the server is only queried with showers that the user actively set and incrementing the interest is justified.
Modifying the same set of sorters interchanged multiple times however can lead to a longer showers list than necessary³. It could maybe be correlated to a global extraAttributes instead (like from global attributes object). But this is not ideal since that order may change. With the current system, changes are coherent.

# Example:

	Initial state:
	filters={}, sorters={}, showers=[]

	Response:
	products=[...], extraAttributes: [a1, a2, a3, a4, a5]

	User sets 1 filter at a2, 1 sorter at a3 and moves a3 further to the left.
	The shown attributes in the table look like [a1, a3, a2, a4, a5]. This could be the showers passed to the server¹ but it is less:
	a2, a4, a5 are cut from the end² because they embody the normal extraAttributes order.
	filters={a2: 'bla'}, sorters={a3: 1}, showers=[a1, a3]

	Server query: SELECT showers, extraAttributes... FROM p WHERE filters ORDER BY sorters
	Response:
	products=[...], extraAttributes: [a2, a4, a5]

	Resulting table: (hopefully still [a1, a3, a2, a4, a5])
	[...showers, ...extraAttributes] with filters and sorters active.
	
	User moves a4 to the right: [a1, a3, a2, a5, a4]
	showers=[a1, a3, a2, a5]
	But no request was made yet (does not happen on a simple column move)
	
	User moves a4 to the left: [a1, a3, a2, a4, a5]
	Can still reconcile with the last extraAttributes:
	showers=[a1, a3]

	User moves a3 to the right: [a1, a2, a3, a4, a5]
	According to last extraAttributes, this results in
	showers=[a1, a2, a3]
	Better would be showers=[] but reference extraAttributes is gone³.


Term "relevant attributes": Concated showers + extraAttributes

---
Seperate query:
- attributes: []
	All attributes there are (maybe make this dynamic one day for when there are a lot of them)
###
export default
	namespaced: true
	state:
		product: 'test'
		result: null
		attributes: [0..10].map((i) =>
			id: i
			name: "attribute #{i}"
		)
		filters: null
		sorters: [
				attribute: 2
				direction: 1
			,
				attribute: 3
				direction: -1
		]
		showers: null
		limit: null
	getters:
		###
		attributesById: (state) ->
			state.attributes.reduce((all, attribute) =>
				all[attribute.id] = attribute
			, {})
		###
		sortersByAttribute: (state) -> # todo vocabulary unclear
			state.attributes.reduce((all, attribute) =>
				sorterIndex = state.sorters.findIndex((sorter) => sorter.attribute == attribute.id)
				if sorterIndex > -1
					all[attribute.id] =
						index: sorterIndex
						direction: state.sorters[sorterIndex].direction
				else
					all[attribute.id] = {}
				return all
			, {})
	mutations:
		removeSorterAt: (state, index) -> Vue.delete(state.sorters, index)
		addSorter: (state, sorter) -> state.sorters.push(sorter)
		setResult: (state, result) -> state.result = result
	actions:
		toggleSortDirection: ({ commit, state, getters }, { attribute, direction }) ->
			sorter = getters.sortersByAttribute[attribute]
			if sorter
				commit('removeSorterAt', sorter.index)
				if sorter.direction == direction
					return
			commit('addSorter', { attribute, direction })
		search: ({ commit, state }) ->
			if state.result
				return
			response = await axios.get("p/#{state.product}")
			commit('setResult', response.data)
