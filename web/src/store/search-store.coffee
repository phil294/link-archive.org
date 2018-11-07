import storageService from '@/services/storage-service'
import axios from 'axios'

export default
	namespaced: true
	state:
		product: null
		result: null
		attributes: null
		filters: null
		sorters: null
	mutations:
		setResult: (state, result) -> state.result = result
	actions:
		search: ({ commit, state }) ->
			response = await axios.get("p/#{state.product}")
			commit('setResult', response.data)
