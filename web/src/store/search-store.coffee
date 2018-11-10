import storageService from '@/services/storage-service'
import axios from 'axios'
import Vue from 'vue'

export default
	namespaced: true
	state:
		product: 'test'
		result: null
		attributes: [
				id: 1
				name: 'a1asdfasdf'
			,
				id: 2
				name: 'a2asdfasdf'
			,
				id: 3
				name: 'a3'
		]
		filters: null
		sorters: [
				attribute: 2
				direction: 1
			,
				attribute: 3
				direction: -1
		]
	getters:
		/// attributesById: (state) ->
			state.attributes.reduce((all, attribute) =>
				all[attribute.id] = attribute
			, {})
		///
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
