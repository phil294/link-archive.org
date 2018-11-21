<template lang="slm">
# :_='
one-time-button :used-prompt=buttonPrompt @click=clicked ref=otb
	slot
# '
</template>

<script lang="coffee">
import Vue from 'vue'

###
 * Pass an `action` to this component that will resolve to a promise. The button will wait for this promise before it resets its loading state.
###
export default Vue.extend(
	name: 'PromiseButton'
	props:
		action:
			type: Function
			required: true
		resetAfterSuccess:
			type: Boolean
			default: true
		successPrompt:
			type: String
			default: 'Done!'
	data: =>
		buttonPrompt: undefined
	methods:
		clicked: ->
			try
				await this.$props.action()
				if @$props.resetAfterSuccess
					@$refs.otb.reset()
				else
					@$data.buttonPrompt = @$props.successPrompt
			catch e
				# todo error message like promiseform? aka google like mail login error
				@$refs.otb.reset()
				throw e

)
</script>
