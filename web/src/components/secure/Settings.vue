<template lang="slm">
	h1 Settings
		
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import PromiseButton from '@/components/PromiseButton'

export default Vue.extend(
	name: 'Settings'
	methods: {
		...mapActions('session', [
			''
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
modal
	height:100%
	fieldset
	margin-bottom:20px
#with-external button
	width:200px
	margin-bottom:10px
#with-external button img.logo 
	margin-right: 5px
</style>
