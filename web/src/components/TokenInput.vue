<template lang="slm">
div
	promise-form#insert-code :action=login_with_token
		label
			| paste the token here:
			input model=token_model name=token required
		template #button_label Log in
</template>

<script lang="coffee">
import Vue from 'vue'

export default Vue.extend
	name: 'TokenInput'
	props:
		token:
			type: String
			default: ''
	data: ->
		token_model: @$props.token
	mounted: ->
		if @$data.token_model
			try await @login_with_token() # if unsuccessful, dont show an error yet. let the user submit the form again and handle the error there
	methods:
		# throws
		login_with_token: ->
			@$data.token_error = ''
			@$store.dispatch 'session/login_with_token', @$data.token_model
			try await @$store.dispatch 'session/refresh_token' # make sure the passed token is valid by asking the server for a new one
			catch e
				throw new Error('The token expired. This was probably issued by the user itself. Please request a new login link above.')
			@$emit 'success'
</script>

<style lang="stylus" scoped>
</style>
