import axios from 'axios'

export default (store) =>
	http_client = axios.create
		baseURL: process.env.VUE_APP_API_ROOT

	http_client.interceptors.request.use (config) =>
		# Not a good idea as it will reset any present error displays
		# store.dispatch 'server_reachable'
		store.commit 'increase_loading_counter'
		# TODO: Remove once https://github.com/axios/axios/issues/3606 is fixed and move to response interceptor error handling below instead:
		{ method, url, params, data } = config
		axios_request_info = { method, url, params, data }
		store.commit 'push_store_history', axios_request_info
		config.axios_request_info = axios_request_info
		# TODO: Remove setting error_content and its references once https://github.com/axios/axios/issues/2387 is fixed:
		config.error_context = new Error("Thrown at:")
		config.headers.common['x-app-version'] = store.state.app_version
		return config

	http_client.interceptors.response.use (response) =>
		store.commit 'decrease_loading_counter'
		response
	, (error) =>
		store.commit 'decrease_loading_counter'
		formatted_error =
			######## s.a.
			original_stack: error.config?.error_context?.stack
			axios_request_info: error.config?.axios_request_info
			########
			stack: error.stack
			message: error.message
			data: error.response?.data or error.response?.statusText or null
			status: error.response?.status or 0
		if error.response?.status == 409
			formatted_error.data = 'Error 409 CONFLICT – The request could not be completed because it would result in an unexpected data conflict (duplicate name, missing reference or the like).'
		else if (error.response == undefined || error.code == 'ECONNABORTED') && !formatted_error.stack
			formatted_error.data = 'Cannot reach server'
		# todo class-validation errors: format properly
		return Promise.reject formatted_error
	
	return http_client