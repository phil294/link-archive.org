<template lang="slm">
form.column @submit.prevent=submit enctype="multipart/form-data"
	/ using an invisible fieldset wrapper to group disable attribute for all children (does not work on <form> directly)
	fieldset.low-key.column :disabled=disabled_or_loading
		legend
			slot name=legend
		slot
	#actions.row.center.padding.gap-10
		slot name=button :loading=loading
			loading-button.btn v-if="!no_submit_button||loading" :loading=button_loading :disabled=disabled_or_loading
				slot name=button_label
					| Submit
				template #used_prompt=""
					slot name=button_label_loading
						.column v-if=loading
							span Loading...
							progress :value="progress_display || progress"
							small.time-est v-if=time_remaining_est
								| Time est. remaining: {{ utils.format_seconds(time_remaining_est/1000) }}
						span v-else="" Done!
		button.btn.btn-2.cancel v-if=cancelable :disabled=loading type=button @click=$emit('cancel')
			slot name=cancel_button_label
				| Cancel
		/ TODO: disabled="" when form is unchanged
		button.btn v-if=resetable :disabled=disabled_or_loading type=reset
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
import { nextTick } from 'vue'

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
		disabled:
			type: Boolean
			default: false
		stepcount:
			type: [ Number, String ]
			default: null
	emits: [ 'cancel', 'submit', 'success' ]
	data: =>
		error_response: ''
		loading: false
		button_loading: false
		progress: 1
		progress_display: 1
		action_start: null
		time_remaining_est: null
		time_remaining_est_timer: null
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
					throw new Error "Unexpected progress #{progress}"
				if @progress > 0
					time_passed = dayjs().diff(@action_start)
					time_total_est = time_passed / @progress
					if time_total_est > 10000
						# Show estimated time remaining to the user after ever progress step
						@time_remaining_est = time_total_est - time_passed
						if not @time_remaining_est_timer
							# Steadily decrease the time est sec by sec
							@time_remaining_est_timer = setInterval ( =>
								@time_remaining_est = Math.max(1000, @time_remaining_est - 1000)
								@progress_display = 1 - @time_remaining_est / time_total_est
							), 1000

			@action_start = new Date
			try
				await Promise.all [
					@action {
						...values,
						form_data, values, array_values, event,
						progress: progress_callback
					}
				,
					window.utils.sleep 150 # force delay when the network response is quick, because overly fast button responses are confusing to the user imo
				]
				if not @onetime
					@button_loading = false
				@$emit 'success'
			catch e
				await nextTick() # enforce transition effect even if follow-up error+
				@error_response = e.message or e.data or e
				@button_loading = false
				throw e
			finally
				@loading = false
				@time_remaining_est = null
				@progress_display = null
				clearInterval @time_remaining_est_timer
				@time_remaining_est_timer = null
				@action_start = null
	computed:
		disabled_or_loading: ->
			@disabled or @loading
</script>

<style lang="stylus" scoped>
button
	progress
		width 100%
		height 2px
form.no-click
	cursor progress
fieldset.low-key
	margin 0
	padding 0
	border none
</style>
