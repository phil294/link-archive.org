<template lang="slm">
div
	promise-form#insert-code :action=login_with_token
		label
			| paste the token here:
			input v-model=token_model name=token required=""
		template #button_label="" Log in
</template>

<script lang="coffee">
import Vue from 'vue'

export default
	name: 'TokenInput'
	props:
		token:
			type: String
			default: ''
	data: ->
		token_model: @token
	mounted: ->
		if @token_model
			try await @login_with_token() # if unsuccessful, dont show an error yet. let the user submit the form again and handle the error there
	methods:
		# throws
		login_with_token: ->
			@token_error = ''
			@$store.dispatch 'session/login_with_token', @token_model.trim()
			@$emit 'success'
</script>

<style lang="stylus" scoped>
</style>
