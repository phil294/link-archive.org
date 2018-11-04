<template lang="slm">
	button -disabled="loading || disabled" -type=type %click=clicked
		slot if=!loading Click me
		span v-else loading...
</template>

<script lang="coffee">
###
 * Button that, when clicked, replaces itself with a loading animation
 * and fires $click-event.
 * Alternatively, call .setLoading() and .reset() manually and disable
 * automatic loading state with setLoadingAutomatically=false.
###
export default
	name: 'ProgressButton'
	props:
		type:
			type: String
			default: 'button'
		disabled:
			type: Boolean
			default: false
		setLoadingAutomatically:
			type: Boolean
			default: true,
	data: =>
		loading: false
	methods:
		clicked: ->
			if @$props.setLoadingAutomatically
				@$data.loading = true
			@$emit('click')
		# Consider using a normal button instead
		reset: ->
			@$data.loading = false
		setLoading: ->
			@$data.loading = true
</script>

<style scoped>
</style>
