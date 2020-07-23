<template lang="slm">
loading-button :loading=button_loading||disabled @click=clicked
	slot
	template #used_prompt=""
		/ todo pass loading as slotscope (as in promiseform)
		slot name=success_prompt v-if=!error
			.column v-if=loading||disabled
				slot name=loading_prompt
					| Loading...
				progress :value=progress
			span v-else=""
				slot name=done_prompt
					| $done_prompt
		slot name=error_prompt v-else="" :error=error
			div.danger UNEXPECTED ERROR: $error
</template>

<script lang="coffee">

###
 * Pass an `action` to this component that will resolve to a promise. The button will wait for this promise before it resets its loading state.
 * If there is at least one input associated to the button, use PromiseForm instead.
 * Shows error if anything fails, but is *not* supposed to be an error handling
 * component. If desired, PromiseForm instead.
###
export default
	name: 'PromiseButton'
	props:
		action:
			type:
				-	Function
				-	Promise
			required: true
		onetime:
			type: Boolean
			default: false
		disabled:
			type: Boolean
			default: false
		stepcount:
			type: [ Number, String ]
			default: null
	data: =>
		error: ''
		loading: false
		button_loading: false
		progress: 1
		done_prompt: 'Done!'
	methods:
		clicked: ->
			@error = ''
			@loading = true
			@button_loading = true
			try
				if @action instanceof Promise
					result = await @action
				else
					progress_callback = (progress) =>
						if progress != undefined
							@progress = progress
						else if @stepcount
							@progress += 1/@stepcount
						else
							throw new Error "Unexpected progress #{progress}"
					action_response = @action progress_callback
					# if not action_response typeof Promise
					# 	throw 'PromiseForm action response is not typeof Promise!'
					# ^ there is no reason not to accept non-promises here
					# as promise-button also serves the purpose of displaying
					# errors
					result = await action_response
				if @onetime or result
					@done_prompt = result
				else
					@button_loading = false
				# if the action fails, do not reenable the button. show error and become stale.
			catch e
				@error = e
				throw e
			finally
				@loading = false
</script>

<style lang="stylus" scoped>
button
	progress
		width 100%
		height 2px
</style>