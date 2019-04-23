<template lang="slm">
div
	h1 Log in or create account	
	div#register-or-login
		fieldset#with-email.box
			legend With email
			div if=!show_mail_sent
				promise-form button-label=`Request mail to log in` :action=request_mail
					label
						| Email
						input model=email type=email name=email placeholder=email@example.com required
					read-more.note summary="(Why no password?)"
						p
							| You can simply login by requesting a login link via mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones in the user settings.
						p
							| The main reasons for implementing a password-less login can be found in 
							a href="https://goo.gl/czxFnf" this article
							|. In short: Passwords are more of a security threat than measurement.
						p
							| If you feel you <em>really</em> need to use a password, you can configure one in the account settings once you are logged in.
						label
							| If you did that, you can log in with it here:
							input type=password name=password
			div#mail-sent.padding-l else
				div
					p
						| An email has been sent to 
						strong $email
					p
						| You can log in by clicking the link in the email
					p.center
						strong - OR -
					token-input @success=login_successful
				hr
				a @click=show_mail_sent=false ⮜ Send another mail
		fieldset#with-external.box
			legend Or
			div v-for="provider in external_login_providers" :key=provider.name
				promise-button.center if=provider.initialized :action=external_login(provider) # if this goes wrong, nothing is shown todo
					img.logo :src="'static/'+provider.name+'.png'"
					| Log in with $provider.name
				div.note v-else Loading $provider.name login scripts...
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import external_login_providers from '@/external-login-providers'

loaded_external_login_providers = {}

export default Vue.extend
	name: 'Authenticate'
	data: =>
		email: ''
		show_mail_sent: false
		external_login_providers: external_login_providers
	created: ->
		@$data.external_login_providers.forEach provider =>
			if !loaded_external_login_providers[provider.name]
				await provider.load()
				loaded_external_login_providers[provider.name] = true
			await provider.setup()
	methods:
		request_mail: ({ values }) ->
			if values.password
				# todo: implement entire password stuff
				alert("password mechanic not yet implemented.")
			else
				await @$store.dispatch 'session/request_token_mail', values.email
				@$data.show_mail_sent = true
		external_login: provider -> =>
			token = await provider.login()
			await @$store.dispatch 'session/external_login_provider_login_with_token',
				token: token # todo can this throw?
				provider_name: provider.name
			@login_successful()
		login_successful: ->
			@$emit 'authenticated'
</script>

<style lang="stylus" scoped>
fieldset
	margin-bottom 20px
#with-external button
	width 200px
	margin-bottom 10px
#with-external button img.logo 
	margin-right 5px
</style>
