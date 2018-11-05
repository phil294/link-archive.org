<template lang="slm">
	div
		promise-form#insert-code button-label=Ok -action=loginWithToken
			label for=token paste the token here:
			input#token model=tokenModel type=text name=token required
</template>

<script lang="coffee">
import Vue from 'vue'
import PromiseForm from '@/components/PromiseForm'

export default Vue.extend(
	name: 'TokenInput'
	components: { PromiseForm }
	props:
		token:
			type: String
			default: ''
	data: () ->
		tokenModel: @$props.token
	mounted: () ->
		if @$data.tokenModel
			@loginWithToken()
	methods:
		# throws
		loginWithToken: ->
			@$data.tokenError = ''
			@$store.dispatch('session/loginWithToken', @$data.tokenModel)
			@$emit('success')
)
</script>

<style lang="stylus" scoped>
</style>
