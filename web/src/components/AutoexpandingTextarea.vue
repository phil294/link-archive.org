<template lang="slm">
textarea :name=name rows=1 :maxlength=maxlength :required=required :placeholder=placeholder :value=model @input=on_input @focus=on_focus @blur=on_blur ref=ref :style.height=height
</template>

<script lang="coffee">
export default
	name: 'AutoexpandingTextarea'
	props:
		### enable v-model ###
		value:
			type: String
			default: ''
		maxlength:
			default: null
		required:
			type: Boolean
			default: false
		placeholder:
			type: String
			default: ''
		name:
			type: String
	mounted: ->
		await @update_content_height()
		await @on_blur()
	data: ->
		### model and thus, textarea value, take their value either from
		dynamically changing @$props.value or from user input directly. ###
		model: @$props.value
		height: 'inherit'
		content_height: 0
	methods:
		on_input: event ->
			new_value = event.target.value
			@model = new_value
			@$emit 'input', new_value
			@update_content_height()
		on_focus: ->
			@height = @content_height
		on_blur: ->
			@content_height = @height
			await @$nextTick()
			@height = 'inherit'
		update_content_height: ->
			@height = ''
			await @$nextTick()
			@height = @$refs.ref.scrollHeight + 'px'
	watch:
		value: new_value ->
			@model = new_value
</script>

<style lang="stylus" scoped>
</style>