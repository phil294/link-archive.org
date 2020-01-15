<template lang="slm">
form.column :class.no-click=loading @submit.prevent=submit
	legend
		slot name=legend
	slot
	#actions.row.align-center
		/ todo pass loading as slotscope prop to parent
		slot name=button
			loading-button.btn :class.right=button_float_right :loading=button_loading :disabled=nosubmit
				slot name=button_label
					| Submit
				template #used_prompt=""
					slot name=button_label_loading
						.column v-if=loading
							span Loading...
							progress :value=progress
						span v-else="" Done!
		button.btn.btn-2.cancel v-if=cancelable :class.right=button_float_right :disabled=loading type=button @click=$emit('cancel')
			slot name=cancel_button_label
				| Cancel
		/ TODO: disabled="" when form is unchanged
		button.btn v-if=resetable :class.right=button_float_right :disabled=loading type=reset
			slot name=reset_button_label
				| Reset
	div.error.fade-in v-if=error_response
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
		progress: 0
	methods:
		submit: (event) ->
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
				progress_callback = (progress) =>
					@progress = progress
				await @$props.action { form_data, values, event, progress: progress_callback }
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
	progress
		width 100%
		height 2px
form:not(.row)
	> *:not(:last-child):not(:first-child)
		margin-bottom 1.2vh
</style>
