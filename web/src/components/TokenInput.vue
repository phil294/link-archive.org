<template lang="slm">
div
	promise-form#insert-code button-label=Ok :action=login_with_token
		label
			| paste the token here:
			input model=token_model name=token required
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
			@login_with_token()
	methods:
		# throws
		login_with_token: ->
			@$data.token_error = ''
			@$store.dispatch 'session/login_with_token', @$data.token_model
			@$emit 'success'
</script>

<style lang="stylus" scoped>
</style>
