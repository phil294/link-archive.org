<template lang="slm">
# :_='
form @submit.prevent=submit
	slot
	one-time-button ref=submit type=submit :set-loading-automatically=false $buttonLabel
	div.error.fade-in if=errorMessage $errorMessage
# '
</template>

<script lang="coffee">
import Vue from 'vue'

###
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button` (?)+
###
export default Vue.extend(
	name: 'PromiseForm'
	props:
		buttonLabel:
			type: String
			default: 'Submit'
		errorCaption:
			type: String
			default: 'Submit failed'
		### docs ###
		action:
			type: Function
			required: true
	data: =>
		errorResponse: ''
	computed:
		errorMessage: ->
			if @$data.errorResponse then "#{@$props.errorCaption}: #{@$data.errorResponse}" else ''
	methods:
		submit: event ->
			@$data.errorResponse = ''
			@$refs.submit.setUsed()
			@$emit('submit', event)
			formData = new FormData(event.target)
			values = [...formData.entries()]
				.reduce((all, entry) =>
					all[entry[0]] = entry[1]
					return all
				, {})
			try
				await @$props.action(formData, values, event)
			catch e
				await @$nextTick() # enforce transition event even if follow-up error+
				@$data.errorResponse = e
				throw e
			finally
				if @$refs.submit # component still alive?
					@$refs.submit.reset()
)
</script>

<style lang="stylus" scoped>
</style>
