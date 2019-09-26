import storage_service from '@/services/storage-service'
import axios from 'axios'

export default
	namespaced: true
	state: ->
		token: null
		session: null
	getters:
		is_logged_in: state ->
			!!state.session
	mutations:
		set_token: (state, token) ->
			state.token = token
		set_session: (state, session) ->
			state.session = session
	actions:
		# validate token and set token & session. throws # todo rename this to set_token or set_session or similar
		login_with_token: ({ commit }, token) -> # todo rename to set_token?
			try
				payload = JSON.parse(window.atob(token.trim().split('.')[1].replace('-', '+').replace('_', '/')))
			catch
				throw new Error 'Malformed token'
			session = payload.user
			if !session.email && !session.external_type
				throw new Error 'Invalid token: no email and no external_type'
			commit 'set_token', token
			storage_service.set 'token', token
			commit 'set_session', session
		request_token_mail: (_, email) ->
			await axios.get "authentication/requesttokenmail?email=#{email}"
		external_login_provider_login_with_token: ({ dispatch }, { token, provider_name }) ->
			response = await axios.post "authentication/#{provider_name}tokenlogin?token=#{token}"
			jwt = response.data
			dispatch 'login_with_token', jwt
		refresh_token: ({ dispatch }) ->
			response = await axios.get 'authentication/refreshtoken'
			jwt = response.data
			await dispatch 'login_with_token', jwt
		logout: ({ commit }) ->
			commit 'set_token', null
			commit 'set_session', null
			storage_service.set 'token', null
		invalidate_all_tokens: ({ dispatch }) ->
			now = Date.now() / 1000
			await dispatch 'refresh_token' # with current date
			await axios.patch 'user', { min_iat: now - 5 } # with date -5. this might also log out the current user if his date is inaccurate. but can live with that
