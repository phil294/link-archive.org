<template lang="slm">
	form %submit.prevent=submit
		slot
		one-time-button ref=submit type=submit -set-loading-automatically=false {{ buttonLabel }}
		div.error.fade-in if=errorMessage {{ errorMessage }}
</template>

<script lang="coffee">
import Vue from 'vue'
import OneTimeButton from '@/components/OneTimeButton'

###
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button`.
###
export default Vue.extend(
	name: 'PromiseForm'
	components: { OneTimeButton }
	props:
		buttonLabel:
			type: String
			default: 'Submit'
		errorCaption:
			type: String
			default: 'Submit failed'
		action:
			type: Function
			required: true
	data: =>
		errorResponse: ''
	computed:
		errorMessage: ->
			if @$data.errorResponse then "#{@$props.errorCaption}: #{@$data.errorResponse}" else ''
	methods:
		submit: (event) ->
			@$data.errorResponse = ''
			@$refs.submit.setUsed()
			@$emit('submit', event)
			try
				await @$props.action(event)
			catch error
				await @$nextTick() # enforce transition event even if follow-up error
				@$data.errorResponse = error
			finally
				if @$refs.submit # component still alive?
					@$refs.submit.reset()
)
</script>

<style lang="stylus" scoped>
</style>
