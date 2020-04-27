<template lang="slm">
div
	h1 Log in or create account
	div#register-or-login
		section#with-email.box.padding-l
			legend With email
			div v-if=!show_mail_sent
				promise-form :action=request_mail
					label
						| Email
						input v-model=email type=email name=email placeholder=email@example.com required=""
					read-more.note
						template #summary="" (Why no password?)
						p
							| You can simply login by requesting a login link via mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones in the user settings.
						p
							| The main reasons for implementing a password-less login can be found in 
							a href="https://goo.gl/czxFnf" this article
							|. In short: Passwords are more of a security threat than measurement.
						p
							strike If you feel you <em>really</em> need to use a password, you can configure one in the account settings once you are logged in.
						label
							strike If you did that, you can log in with it here:
							input type=password name=password
						span
							| (not supported yet!)
					template #button_label="" Request mail to log in
			div#mail-sent.padding-l v-else=""
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
		section#with-external.box.padding-l
			legend Or
			div.provider v-for="provider in external_login_providers" :key=provider.name
				div.row v-if=!provider.initialized
					div.center
						em Load login for:
					promise-button.load :action=external_initialize(provider)
						img.logo :src="'/img/'+provider.name+'-button.png'"
				div.row v-else=""
					div.center
						div.column
							em Click again: 
							strong Sign in with:
					promise-button.login :action=external_login(provider)
						img.logo :src="'/img/'+provider.name+'-button.png'"
				promise-button.btn.login v-else="" :action=external_login(provider)
</template>

<script lang="coffee">
import Vue from 'vue'
import external_login_providers from '@/external-login-providers'
import TokenInput from '@/views/TokenInput'

export default
	components: { TokenInput }
	name: 'Authenticate'
	data: =>
		email: ''
		show_mail_sent: false
		external_login_providers: external_login_providers
	methods:
		request_mail: ({ values }) ->
			if values.password
				# todo: implement entire password stuff
				alert("password mechanic not yet implemented.")
			else
				await @$store.dispatch 'session/request_token_mail', values.email
				@show_mail_sent = true
		external_initialize: (provider) -> =>
			try
				await provider.initialize()
			catch e
				if e.message == 'Cookie consent denied'
					return
				throw e
		external_login: (provider) -> =>
			token = await provider.login()
			if not token
				return
			await @$store.dispatch 'session/external_login_provider_login_with_token',
				token: token # todo can this throw?
				provider_name: provider.name
			@login_successful()
		login_successful: ->
			@$emit 'authenticated'
</script>

<style lang="stylus" scoped>
section
	margin-bottom 20px
#with-email
	> *
		margin 10px
#with-external
	.provider
		button.load, button.login
			margin-left 12px
</style>
