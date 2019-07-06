# should be abstract
class ExternalLoginProvider
	initialized: false
	name: ''

	@append_script: url ->
		script_el = document.createElement 'script'
		new Promise (ok, notok) =>
			script_el.onload = ok
			script_el.onerror = notok
			script_el.src = url
			document.head.appendChild script_el

	setup: ->
		await @initialize()
		@initialized = true

	### to be called once at start ### # todo loaded should be property (maybe static)
	load: -> false

	### to be called on component creation (may be multiple times) by .setup() ### # todo put this into constructor?!
	initialize: -> false

	### @return token ###
	login: -> false

class GoogleLogin extends ExternalLoginProvider
	name: 'google'
	
	load: ->
		await ExternalLoginProvider.append_script 'https://apis.google.com/js/api.js' # todo is this functionality available as a module?
		await new Promise ok => window.gapi.load('auth2', ok)

	initialize: ->
		@google_auth = await window.gapi.auth2.init
		client_id: process.env.GOOGLE_CLIENT_ID

	login = ->
		google_user = await @google_auth.signIn()
		google_user.getAuthResponse().id_token

class FacebookLogin extends ExternalLoginProvider
	name: 'facebook'

	load: ->
		await ExternalLoginProvider.append_script 'https://connect.facebook.net/en_US/sdk.js'
		window.fb_async_init = => window.FB.init
			appId: process.env.FACEBOOK_APP_ID
			cookie: true
			xfbml: true
			version: 'v3.0'
	
	login: ->
		new Promise (ok, notok) =>
			window.FB.login response =>
				if response.status == 'connected'
					ok response.auth_response.access_token
				else
					notok response

export default [ new GoogleLogin(), new FacebookLogin() ]
