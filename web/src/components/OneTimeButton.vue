<template lang="slm">
button.btn :disabled=used :type=type @click=clicked
	slot if=!used Click me
	slot else name=used_prompt loading...
</template>

<script lang="coffee">
###
 * Button that, when clicked, replaces itself with a loading animation
 * and fires $click-event.
 * Alternatively, call .set_loading() and .reset() manually and disable
 * automatic loading state with set_loading_automatically=false.
 * Also see PromiseButton for coupling this button to a promising action.
###
export default
	name: 'ProgressButton' # todo
	props:
		type:
			type: String
			default: 'button'
		set_loading_automatically:
			type: Boolean
			default: true
	data: =>
		used: false
	methods:
		clicked: ->
			if @$props.set_loading_automatically
				@used = true
			@$emit 'click'
		reset: ->
			@used = false
		set_used: ->
			@used = true
</script>

<style lang="stylus" scoped>
</style>
