<template lang="slm">
button.btn :disabled=used :type=type @click=clicked
	slot if=!used Click me
	span else $used_prompt
</template>

<script lang="coffee">
###
 * Button that, when clicked, replaces itself with a loading animation
 * and fires $click-event.
 * Alternatively, call .set_loading() and .reset() manually and disable
 * automatic loading state with set_loading_automatically=false.
###
export default
	name: 'ProgressButton'
	props:
		type:
			type: String
			default: 'button'
		set_loading_automatically:
			type: Boolean
			default: true
		used_prompt:
			type: String
			default: 'loading...'
	data: =>
		used: false
	methods:
		clicked: ->
			if @$props.set_loading_automatically
				@$data.used = true
			@$emit 'click'
		reset: ->
			@$data.used = false
		set_used: ->
			@$data.used = true
</script>

<style lang="stylus" scoped>
</style>
