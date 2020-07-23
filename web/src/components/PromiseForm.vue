<template lang="slm">
form.column :class.no-click=loading @submit.prevent=submit enctype="multipart/form-data"
	legend
		slot name=legend
	slot
	#actions.row.center.padding
		/ todo pass loading as slotscope prop to parent
		slot name=button
			loading-button.btn v-if="loading||!no_submit_button" :class.right=button_float_right :loading=button_loading :disabled=nosubmit
				slot name=button_label
					| Submit
				template #used_prompt=""
					slot name=button_label_loading
						.column v-if=loading
							span Loading...
							progress :value=progress
							small.time-est v-if=seconds_remaining_est
								| Time est. remaining: {{ seconds_remaining_est | format_seconds }}
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
import dayjs from 'dayjs'

###
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button` (?)+

 todo duplicate code with promise button
###
export default
	name: 'PromiseForm'
	props:
		button_float_right:
			type: Boolean
			default: false
		no_submit_button:
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
		stepcount:
			type: [ Number, String ]
			default: null
	data: =>
		error_response: ''
		loading: false
		button_loading: false
		progress: 1
		action_start: null
		seconds_remaining_est: null
	methods:
		submit: (event) ->
			@error_response = ''
			@loading = true
			@button_loading = true
			@$emit 'submit', event

			form_data = new FormData event.target
			
			values = {}
			# There can be multiple values for the same form data key, e.g.
			# <input type=file multiple>
			array_values = {}
			for form_key from [...form_data.keys()]
				form_values = form_data.getAll form_key
				values[form_key] = form_values[0]
				array_values[form_key] = form_values

			progress_callback = (progress) =>
				if progress != undefined
					@progress = progress
				else if @stepcount
					@progress += 1/@stepcount
				else
					throw new Error "Unexpected  progress #{progress}"
				if @progress > 0
					time_passed = dayjs().diff(@action_start)
					time_total_est = time_passed / @progress
					if time_total_est > 10000
						@seconds_remaining_est = Math.round((time_total_est - time_passed) / 1000)

			@action_start = new Date
			try
				await @action {
					...values,
					form_data, values, array_values, event,
					progress: progress_callback
				}
				if not @onetime
					@button_loading = false
			catch e
				await @$nextTick() # enforce transition effect even if follow-up error+
				@error_response = e.data || e
				@button_loading = false
				throw e
			finally
				@loading = false
				@seconds_remaining_est = null
				@action_start = null
</script>

<style lang="stylus" scoped>
.right
	float right
button
	progress
		width 100%
		height 2px
</style>
