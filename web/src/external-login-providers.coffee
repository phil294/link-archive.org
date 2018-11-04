# should be abstract
class ExternalLoginProvider
	constructor: (@name) ->
		@initialized = false

	@appendScript: (url) ->
		scriptEl = document.createElement('script')
		new Promise((resolve, reject) => # todo
			scriptEl.onload = resolve
			scriptEl.onerror = reject
			scriptEl.src = url
			document.head.appendChild(scriptEl))

	setup: ->
		await @initialize()
		@initialized = true

	# to be called once at start
	load: ->

	# to be called on component creation (may be multiple times) by .setup()
	initialize: ->

	# @returns token
	login: ->

googleLoginProvider = new ExternalLoginProvider('google')
googleLoginProvider.load = ->
	await ExternalLoginProvider.appendScript('https://apis.google.com/js/api.js') # todo is this functionality available as a module?
	await new Promise((resolve) =>
		window.gapi.load('auth2', resolve))
googleLoginProvider.initialize = ->
	@googleAuth = await window.gapi.auth2.init(
		client_id: process.env.GOOGLE_CLIENT_ID)
googleLoginProvider.login = ->
	googleUser = await @googleAuth.signIn()
	googleUser.getAuthResponse().id_token

facebookLoginProvider = new ExternalLoginProvider('facebook')
facebookLoginProvider.load = ->
	await ExternalLoginProvider.appendScript('https://connect.facebook.net/en_US/sdk.js')
	window.fbAsyncInit = => window.FB.init(
		appId: process.env.FACEBOOK_APP_ID
		cookie: true
		xfbml: true
		version: 'v3.0')
facebookLoginProvider.login = ->
	new Promise((resolve, reject) =>
		window.FB.login((response) =>
			if response.status == 'connected'
				resolve(response.authResponse.accessToken)
			else
				reject(response)))

export default [ googleLoginProvider, facebookLoginProvider ]
