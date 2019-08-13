<template lang="slm">
div#container
	loading-button :loading=button_loading||disabled @click=clicked if=show_button
		slot
		template #used_prompt
			slot name=success_prompt
				span if=loading
					slot name=loading_prompt
						| Loading...
				span else
					slot name=done_prompt
						| Done!
	div.error.fade-in if=error $error
</template>

<script lang="coffee">

###
 * Pass an `action` to this component that will resolve to a promise. The button will wait for this promise before it resets its loading state.
 * If there is at least one input associated to the button, use PromiseForm instead.
###
export default Vue.extend
	name: 'PromiseButton'
	props:
		action:
			type:
				-	Function
				-	Promise
			required: true
		onetime:
			type: Boolean
			default: true
		disabled:
			type: Boolean
			default: false
	data: =>
		error: ''
		loading: false
		button_loading: false
	methods:
		clicked: ->
			@error = ''
			@loading = true
			@button_loading = true
			try
				if @$props.action instanceof Promise
					await @$props.action
				else
					action_response = @$props.action()
					# if not action_response typeof Promise
					# 	throw 'PromiseForm action response is not typeof Promise!'
					# ^ there is no reason to accept non-promises here
					# as promise-button also serves the purpose of displaying
					# errors
					await action_response
			catch e
				@error = e
				throw e
			finally
				@loading = false
				if ! @$props.onetime
					@button_loading = false
	computed:
		show_button: -> ! @onetime or ! @error
</script>

<style lang="stylus" scoped>
div#container
	display inline-block
</style>