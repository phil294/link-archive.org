<template lang="slm">
form @submit.prevent=submit
	slot
	slot name=button
		one-time-button.submit :class.right=button_float_right ref=submit type=submit :set_loading_automatically=false
			slot name=button_label
				| Submit
	div.error.fade-in if=error_response
		span
			slot name=error_caption
				| Submit failed: 
			| $error_response
</template>

<script lang="coffee">
import Vue from 'vue'

###
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button` (?)+
###
export default Vue.extend # <- todo ?
	name: 'PromiseForm'
	props:
		button_float_right:
			type: Boolean
			default: false
		### docs ###
		action:
			type: Function
			required: true
	data: =>
		error_response: ''
	methods:
		submit: event ->
			@$data.error_response = ''
			@$refs.submit.set_used()
			@$emit 'submit', event
			form_data = new FormData event.target
			values = [...form_data.entries()]
				.reduce((all, entry) =>
					all[entry[0]] = entry[1]
					all
				, {})
			try
				await @$props.action { form_data, values, event }
			catch e
				await @$nextTick() # enforce transition effect even if follow-up error+
				@$data.error_response = e
				throw e
			finally
				if @$refs.submit # component still alive?
					@$refs.submit.reset()
</script>

<style lang="stylus" scoped>
.right
	float right
</style>
