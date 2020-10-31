<template lang="slm">
textarea :name=name rows=1 :maxlength=maxlength :required=required :placeholder=placeholder model=model @focus=on_focus @blur=on_blur ref=ref :style=style
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
export default
	name: 'AutoexpandingTextarea'
	mixins: [ emitting_model ]
	props:
		# TODO: unfortunately, maxlength isnt checked when the value is updated
		# via JS (in this case, if `model` is set wihtout user interaction).
		# Here's a SO question about it https://stackoverflow.com/questions/60758779
		# And the only solution seems to be to implement a JS check
		maxlength:
			default: null
		placeholder:
			type: String
			default: ''
	mounted: ->
		await @update_content_height()
		@height = @content_height
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
			await @$nextTick()
			if not @noshrink
				# shrink to fit container. else: keep showing entire content height
				@height = '100%'
			@focussed = false
		update_content_height: ->
			@height = ''
			await @$nextTick()
			if @$refs.ref # idk, was buggy
				@content_height = @$refs.ref.scrollHeight + 'px'
	computed:
		style: ->
			height: @height
			zIndex: if @focussed then 10 else 1
	watch:
		model: ->
			@update_content_height()
			if @focussed
				@height = @content_height
</script>

<style lang="stylus" scoped>
textarea
	resize none
	overflow hidden
</style>