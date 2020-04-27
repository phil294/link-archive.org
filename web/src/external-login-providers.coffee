import storage_service from './services/storage-service'

append_script = (url) ->
	script_el = document.createElement 'script'
	new Promise (ok, notok) =>
		script_el.onload = ok
		script_el.onerror = notok
		script_el.src = url
		document.head.appendChild script_el

class ExternalLoginProvider
	constructor: ->
		@loaded = false
		@initialized = false

	# private
	load: ->
		# To trigger cookie consent if not done yet
		storage_service.set 'external_login_provider_used', true

	# to be called on component creation (may be multiple times)
	initialize: ->
		if not @loaded
			await @load()

	### @returns token ###
	login: ->

class GoogleLoginProvider extends ExternalLoginProvider
	constructor: ->
		super()
		@name = 'Google'
	load: ->
		await super.load()
		await append_script 'https://apis.google.com/js/api.js' # todo is this functionality available as a module?
		await new Promise (ok) => window.gapi.load('auth2', ok)
		@loaded = true
	initialize: ->
		await super.initialize()
		@google_auth = await window.gapi.auth2.init
			client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
		@initialized = true
	login: ->
		try
			google_user = await @google_auth.signIn()
			return google_user.getAuthResponse().id_token
		catch e
			if e.error == "popup_closed_by_user"
				return null
			throw e

class FacebookLoginProvider extends ExternalLoginProvider
	constructor: ->
		super()
		@name = 'Facebook'
	load: ->
		await super.load()
		await append_script 'https://connect.facebook.net/en_US/sdk.js'
		window.fb_async_init = => window.FB.init
			appId: process.env.VUE_APP_FACEBOOK_APP_ID
			cookie: true
			xfbml: true
			version: 'v3.0'
	initialize: ->
		await super.initialize()
		@initialized = true
	login: ->
		new Promise (ok, notok) =>
			window.FB.login (response) =>
				if response.status == 'connected'
					ok response.auth_response.access_token
				else
					notok response

export default [ new GoogleLoginProvider, new FacebookLoginProvider ]