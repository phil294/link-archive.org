import storageService from '@/services/storage-service'
import axios from 'axios'

export default
	namespaced: true
	state:
		token: null
		session: null
	getters:
		isLoggedIn: (state) ->
			!!state.session
	mutations:
		setToken: (state, token) ->
			state.token = token
		setSession: (state, session) ->
			state.session = session
	actions:
		# validate token and set token & session. throws
		loginWithToken: ({ commit }, token) ->
			try
				payload = JSON.parse(window.atob(token.trim().split('.')[1].replace('-', '+').replace('_', '/')))
			catch error
				throw new Error('Malformed token')
			session = payload
			if !session.email && !session.externalType
				throw new Error('Invalid token: no email and no externalType')
			commit('setToken', token)
			storageService.setToken(token)
			commit('setSession', session)
		requestTokenMail: (_, email) ->
			await axios.get("authentication/requesttokenmail?email=#{email}")
		externalLoginProviderLoginWithToken: ({ dispatch }, { token, providerName }) ->
			response = await axios.post("authentication/#{providerName}tokenlogin?token=#{token}")
			jwt = response.data
			dispatch('loginWithToken', jwt)
		logout: ({ commit }) ->
			commit('setToken', null)
			commit('setSession', null)
			storageService.setToken(null)
		invalidateAllTokens: ->
			now = Date.now()
			# response = await axios.get('secure/refreshtoken') # date + 1
			# jwt = response.data
			# await dispatch('loginWithToken', jwt) # shouldnt be called login..? is just setting token
			await axios.patch('secure/user/', { minIat: now })
