import axios from 'axios'

export default {
	beforeCreate({ error, store }, inject) {
		const http_client = axios.create({
			baseURL: process.env.VUE_APP_API_ROOT
		})

		http_client.interceptors.request.use(config => {
			store.dispatch('server_reachable')
			const token = store.state.session.token
			if(token)
				config.headers.Authorization = `Bearer ${token}`
			return config
		})

		http_client.interceptors.response.use((response => response), (axios_error) => {
			const resp = axios_error.response
			if (resp) {
				// catch and handle
				return error(resp.data || resp.statusText || 'unknown error message', resp.status)
			}
			return Promise.reject(axios_error)
		})

		inject('http', http_client)
	},
}
