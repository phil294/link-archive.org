<template lang="slm">
# :_='
button.btn :disabled=used :type=type @click=clicked
	slot if=!used Click me
	span else {{ usedPrompt }}
# '
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
		setLoadingAutomatically:
			type: Boolean
			default: true
		usedPrompt:
			type: String
			default: 'loading...'
	data: =>
		used: false
	methods:
		clicked: ->
			if @$props.setLoadingAutomatically
				@$data.used = true
			@$emit('click')
		reset: ->
			@$data.used = false
		setUsed: ->
			@$data.used = true
</script>

<style lang="stylus" scoped>
</style>
