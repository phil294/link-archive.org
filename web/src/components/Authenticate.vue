<template lang="slm">
# :_='
div
	h1 Log in or create account	
	div#register-or-login
		fieldset#with-email.box
			legend With email
			div if=!showMailSent
				promise-form button-label="Request mail to log in" :action=requestMail
					label for=email Email
					input#email model=email type=email name=email placeholder=email@example.com required
				read-more.note summary="(Why no password?)"
					p
						| You can simply login by requesting a login link via mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones in the user settings.
					p
						| The main reasons for implementing a password-less login can be found in 
						a href="https://goo.gl/czxFnf" this article
						|. In short: Passwords are more of a security threat than measurement.
					p
						| If you feel you 
						em really 
						| need to use a password, you can configure one in the account settings once you are logged in.
			div#mail-sent.padding-l else
				div
					p
						| An email has been sent to 
						em $email
					p
						| You can log in by clicking the link in the email
					p.center
						strong - OR -
					token-input @success=authenticated
				hr
				a @click=showMailSent=false ⮜ Send another mail
		fieldset#with-external.box
			legend Or
			div v-for="provider in externalLoginProviders" :key=provider.name
				promise-button.center if=provider.initialized :action=externalLogin(provider)
					img.logo :src='static/'+provider.name+'.png'
					| Log in with $provider.name
				div.note v-else Loading $provider.name login scripts...
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import externalLoginProviders from '@/external-login-providers'

loadedExternalLoginProviders = {}

export default Vue.extend(
	name: 'Authenticate'
	data: =>
		email: ''
		showMailSent: false
		externalLoginProviders: externalLoginProviders # todo shorthand?
	created: ->
		for provider from @$data.externalLoginProviders
			if !loadedExternalLoginProviders[provider.name]
				await provider.load() # todo without () ?
				loadedExternalLoginProviders[provider.name] = true
			await provider.setup()
	methods: {
		requestMail: values ->
			await @$store.dispatch('session/requestTokenMail', values.email)
			@$data.showMailSent = true
		externalLogin: provider -> =>
			token = await provider.login()
			await @$store.dispatch('session/externalLoginProviderLoginWithToken',
				token: token # todo can this throw? #todo shorthand
				providerName: provider.name)
			@$emit('authenticated')
	}
)
</script>

<style lang="stylus" scoped>
fieldset
	margin-bottom:20px
#with-external button
	width:200px
	margin-bottom:10px
#with-external button img.logo 
	margin-right: 5px
</style>
