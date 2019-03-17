# should be abstract
class ExternalLoginProvider
	constructor: @name ->
		@initialized = false

	@append_script: url ->
		script_el = document.createElement 'script'
		new Promise(ok, notok) =>
			script_el.onload = ok
			script_el.onerror = notok
			script_el.src = url
			document.head.appendChild script_el

	setup: ->
		await @initialize()
		@initialized = true

	# to be called once at start
	load: ->

	# to be called on component creation (may be multiple times) by .setup()
	initialize: ->

	# @returns token
	login: ->

google_login_provider = new ExternalLoginProvider('google')
google_login_provider.load = ->
	await ExternalLoginProvider.append_script 'https://apis.google.com/js/api.js' # todo is this functionality available as a module?
	await new Promise ok => window.gapi.load('auth2', ok)
google_login_provider.initialize = ->
	@google_auth = await window.gapi.auth2.init
		client_id: process.env.GOOGLE_CLIENT_ID
google_login_provider.login = ->
	google_user = await @google_auth.signIn()
	google_user.getAuthResponse().id_token

facebook_login_provider = new ExternalLoginProvider 'facebook'
facebook_login_provider.load = ->
	await ExternalLoginProvider.append_script 'https://connect.facebook.net/en_US/sdk.js'
	window.fb_async_init = => window.FB.init
		appId: process.env.FACEBOOK_APP_ID
		cookie: true
		xfbml: true
		version: 'v3.0'
facebook_login_provider.login = ->
	new Promise (ok, notok) =>
		window.FB.login response =>
			if response.status == 'connected'
				ok response.auth_response.access_token
			else
				notok response

export default [ google_login_provider, facebook_login_provider ]
