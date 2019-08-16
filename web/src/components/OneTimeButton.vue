<template lang="slm">
button.btn :disabled=loading :type=type @click=clicked
	slot if=!loading Click me
	slot else name=used_prompt Loading...
</template>

<script lang="coffee">
###
 * Normal button with two states, normal and loading. You can either bind :loading or
 * pass load_on_click as an attribute.
 * When the loading property is bound to a promise, you should probably be using
 * promise-button or promise-form instead.
###
export default
	name: 'LoadingButton'
	props:
		type:
			type: String
			default: ''
		load_on_click:
			type: Boolean
			default: false
	data: =>
		loading: false
	methods:
		clicked: event ->
			@$emit 'click'
			if @$props.load_on_click
				if @type == 'submit' or event.currentTarget.form
					# Do not set :disabled right away because that would prevent
					# parent form submit events from happening. $nextTick doesnt do
					# it, timeout 1 seems to be fine.
					# Alternative: Manual event.currentTarget.form.submit() when
					# available, but for some reason this doesnt trigger the form
					# handler also
					await new Promise ok => setTimeout(ok, 1)
				@loading = true
</script>

<style lang="stylus" scoped>
</style>
