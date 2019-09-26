<template lang="slm">
div
	promise-form#insert-code :action=login_with_token
		label
			| paste the token here:
			input model=token_model name=token required
		template #button_label Log in
</template>

<script lang="coffee">
export default Vue.extend
	name: 'TokenInput'
	props:
		token:
			type: String
			default: ''
	data: ->
		token_model: @$props.token
	mounted: ->
		if @token_model
			try await @login_with_token() # if unsuccessful, dont show an error yet. let the user submit the form again and handle the error there
	methods:
		# throws
		login_with_token: ->
			@token_error = ''
			@$store.dispatch 'session/login_with_token', @token_model.trim()
			try
				await @$store.dispatch 'session/refresh_token' # make sure the passed token is valid by asking the server for a new one
				@$emit 'success'
			catch e # fixme network error etc
				if e.status == 401
					throw new Error('The token was not accepted. It probably expired. This was probably issued by the user itself. Please request a new login link above.')
				throw e
</script>

<style lang="stylus" scoped>
</style>
