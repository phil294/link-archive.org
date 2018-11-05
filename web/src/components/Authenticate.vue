<template lang="slm">
	div#modal
		main.box.padding-xl
			button#close type=button %click=hideAuthenticateModal 🗙
			h1 Log in or create account	
			div#register-or-login
				fieldset#with-email.box
					legend With email
					div v-if="!showMailSent"
						promise-form button-label="Request mail to log in" -action=requestMail
							label for=email Email
							input#email model=email type=email name=email placeholder=email@example.com required
						read-more.note summary="(Why no password?)"
							p
								| You can simply login by requesting a login link via mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones 
								a href="TODO" here
								| .
							p
								| The main reasons for implementing a password-less login can be found in 
								a href="https://goo.gl/czxFnf" this article
								|. In short: Passwords are more of a security threat than measurement.
							p
								| If you feel you 
								em really
								| need to use a password, you can configure one in the account settings once you are logged in.
					div#mail-sent.padding-l v-else
						div
							p
								| An email has been sent to
								em {{ email }}
							p
								| You can log in by clicking the link in the email
							p.center
								strong - OR -
							token-input %success=hideAuthenticateModal
						hr
						a %click=showMailSent=false ⮜ Send another mail
				fieldset#with-external.box
					legend Or
					div v-for="provider in externalLoginProviders" -key=provider.name
						promise-button if=provider.initialized -action=externalLogin(provider)
							img.logo -src='static/'+provider.name+'.png'
							| Log in with {{ provider.name }}
						div.note v-else Loading {{ provider.name }} login scripts...
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import TokenInput from '@/components/TokenInput'
import PromiseButton from '@/components/PromiseButton'
import PromiseForm from '@/components/PromiseForm'
import ReadMore from '@/components/ReadMore'
import externalLoginProviders from '@/external-login-providers'

loadedExternalLoginProviders = {}

export default Vue.extend(
	name: 'Authenticate'
	components: { TokenInput, PromiseButton, PromiseForm, ReadMore }
	data: =>
		email: ''
		loading: false
		showMailSent: false
		externalLoginProviders: externalLoginProviders # todo shorthand?
	created: ->
		for provider from @$data.externalLoginProviders
			if !loadedExternalLoginProviders[provider.name]
				await provider.load() # todo without () ?
				loadedExternalLoginProviders[provider.name] = true
			await provider.setup()
	methods: {
		...mapActions([
			'hideAuthenticateModal'
		])
		requestMail: (event) ->
			@$data.loading = true
			try
				await @$store.dispatch('session/requestTokenMail', event.target.elements.email.value) # using form data, not v-model
				@$data.tokenError = ''
				@$data.showMailSent = true
			finally
				@$data.loading = false
		externalLogin: (provider) -> =>
			token = await provider.login()
			await @$store.dispatch('session/externalLoginProviderLoginWithToken',
				token: token # todo can this throw?
				providerName: provider.name)
			@$store.dispatch('hideAuthenticateModal')
	}
)
</script>

<style lang="stylus" scoped>
#modal
	position:fixed
	top:0
	left:0
	padding: 2%
	width:100%
	height:100%
	box-sizing: border-box
	background: rgba(0,0,0,0.08)
main
	height:100%
	max-width:400px
	margin: 0 auto
	position: relative
fieldset
	margin-bottom:20px
#close
	position: absolute
	top:0
	right:0
#with-external button
	display: flex
	align-items: center
	width:200px
	margin-bottom:10px
#with-external button img.logo 
	margin-right: 5px
</style>
