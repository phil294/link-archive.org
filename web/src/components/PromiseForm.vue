<template lang="slm">
form @submit.prevent=submit
	fieldset :disabled=loading
		slot
		slot name=button
			button.btn :class.right=button_float_right :disabled=loading
				slot name=button_label
					| Submit
		div.error.fade-in if=error_response
			span
				slot name=error_caption # todo make more use of
					| Submit failed: 
				| $error_response
</template>

<script lang="coffee">

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
		loading: false
	methods:
		submit: event ->
			@error_response = ''
			@loading = true
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
				@error_response = e
				# throw e
			finally
				@loading = false
</script>

<style lang="stylus" scoped>
.right
	float right
</style>
