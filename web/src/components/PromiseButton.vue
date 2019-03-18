<template lang="slm">
# :_='
one-time-button :used_prompt=button_prompt @click=clicked ref=otb
	slot
# '
</template>

<script lang="coffee">
import Vue from 'vue'

###
 * Pass an `action` to this component that will resolve to a promise. The button will wait for this promise before it resets its loading state.
###
export default Vue.extend
	name: 'PromiseButton'
	props:
		action:
			type: Function
			required: true
		reset_after_success:
			type: Boolean
			default: true
		success_prompt:
			type: String
			default: 'Done!'
		test:
			type: Boolean
			default: true
	data: =>
		button_prompt: undefined
	methods:
		clicked: ->
			try
				await this.$props.action()
				if @$props.reset_after_success && @$refs.otb
					@$refs.otb.reset()
				else
					@$data.button_prompt = @$props.success_prompt
			catch e
				# todo error message like promiseform? aka google like mail login error
				@$refs.otb.reset()
				throw e
</script>
