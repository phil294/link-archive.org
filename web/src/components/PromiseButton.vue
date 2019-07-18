<template lang="slm">
one-time-button @click=clicked ref=otb if=!error
	slot
	template #used_prompt
		slot name=success_prompt
			| Done!
div.error.fade-in else $error
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
	data: =>
		error: ''
	methods:
		clicked: ->
			try
				await this.$props.action()
				if @$props.reset_after_success && @$refs.otb
					@$refs.otb.reset()
			catch e
				@error = e
				throw e
</script>
