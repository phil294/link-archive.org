<template lang="slm">
button :disabled="loading || disabled" :type=type @click=clicked :class.loading=loading
	slot v-if=!loading Click me
	slot v-else="" name=used_prompt Loading...
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
			default: 'submit'
		disabled:
			type: Boolean
			default: false
		loading:
			type: Boolean
			default: false
		load_on_click:
			type: Boolean
			default: false
	methods:
		clicked: (event) ->
			@$emit 'click'
			if @load_on_click
				if @type == 'submit' or event.currentTarget.form
					# Necessary because the loading state eats this up.
					# Alternative: 1ms timeout
					event.currentTarget.form.requestSubmit()
				@loading = true
</script>

<style lang="stylus" scoped>
button.loading
	cursor progress
</style>
