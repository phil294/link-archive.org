<template lang="slm">
form.column :class.no-click=loading @submit.prevent=submit
	legend
		slot name=legend
	slot
	#actions.row.align-center
		slot name=button # todo pass loading as slotscope prop to parent
			loading-button.btn :class.right=button_float_right :loading=button_loading :disabled=nosubmit
				slot name=button_label
					| Submit
				template #used_prompt
					slot name=button_label_loading
						span if=loading Loading...
						span else Done!
		button.btn.btn-2.cancel if=cancelable :class.right=button_float_right :disabled=loading type=button @click=$emit('cancel')
			slot name=cancel_button_label
				| Cancel
		button.btn if=resetable :class.right=button_float_right :disabled=loading type=reset # TODO: disabled when form is unchanged
			slot name=reset_button_label
				| Reset
	div.error.fade-in if=error_response
		span
			slot name=error_caption
				| Submit failed: 
			| $error_response
</template>

<script lang="coffee">

###
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button` (?)+
###
export default Vue.extend
	name: 'PromiseForm'
	props:
		button_float_right:
			type: Boolean
			default: false
		### docs ###
		action:
			type: Function
			required: true
		cancelable:
			type: Boolean
			default: false
		resetable:
			type: Boolean
			default: false
		onetime:
			type: Boolean
			default: false
		nosubmit:
			type: Boolean
			default: false
	data: =>
		error_response: ''
		loading: false
		button_loading: false
	methods:
		submit: event ->
			@error_response = ''
			@loading = true
			@button_loading = true
			@$emit 'submit', event
			form_data = new FormData event.target
			values = [...form_data.entries()]
				.reduce((all, entry) =>
					all[entry[0]] = entry[1]
					all
				, {})
			try
				await @$props.action { form_data, values, event }
				if not @onetime
					@button_loading = false
			catch e
				await @$nextTick() # enforce transition effect even if follow-up error+
				@error_response = e.data || e
				@button_loading = false
				throw e
			finally
				@loading = false
</script>

<style lang="stylus" scoped>
.right
	float right
button
	margin-right 5px
form:not(.row)
	> *:not(:last-child):not(:first-child)
		margin-bottom 1.2vh
</style>
