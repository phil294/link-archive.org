<template lang="slm">
textarea :name=name rows=1 :maxlength=maxlength :required=required :placeholder=placeholder model=model @focus=on_focus @blur=on_blur ref=ref :style=style
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
export default
	name: 'AutoexpandingTextarea'
	mixins: [ emitting_model ]
	props:
		maxlength:
			default: null
		placeholder:
			type: String
			default: ''
	mounted: ->
		await @update_content_height()
		await @on_blur()
	data: ->
		height: '100%'
		content_height: 0
		focussed: false
	methods:
		on_focus: ->
			@height = @content_height
			@focussed = true
		on_blur: ->
			@content_height = @height
			await @$nextTick()
			@height = '100%'
			@focussed = false
		update_content_height: ->
			@height = ''
			await @$nextTick()
			if @$refs.ref # idk, was buggy
				@height = @$refs.ref.scrollHeight + 'px'
	computed:
		style: ->
			height: @height
			zIndex: if @focussed then 10 else 1
	watch:
		model: ->
			@update_content_height()
</script>

<style lang="stylus" scoped>
textarea
	resize none
	overflow hidden
	font-family unset
	font-size unset
</style>