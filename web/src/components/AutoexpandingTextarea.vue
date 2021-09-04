<template lang="slm">
textarea :name=name rows=1 :maxlength=maxlength :required=required :placeholder=placeholder v-model=model @focus=on_focus @blur=on_blur ref=ref :style=style v-observe-visibility="{callback:on_first_visible,once:true}"
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
		await @on_blur()
	data: ->
		height: '100%'
		content_height: 0
		focussed: false
	methods:
		on_first_visible: (visible) ->
			if visible
				# This can happen and this is all necessary when this component (noshrink=true)
				# is somewhere initially hidden via v-show=false, the scrollheight is falsely 0
				if @content_height == "0px"
					@update_content_height()
		on_focus: ->
			@focussed = true
			await @update_content_height()
			@focussed_content = @model
		on_blur: ->
			await @update_content_height()
			await @$nextTick()
			if not @noshrink
				# shrink to fit container. else: keep showing entire content height
				@height = '100%'
			@focussed = false
		update_content_height: ->
			# Determine scroll height (aka height based on content)
			@height = '1px' # stackoverflow.com/a/3341669/3779853
			await @$nextTick()
			if @$refs.ref # idk, was buggy
				@content_height = @$refs.ref.scrollHeight + 'px'
				if @focussed or @noshrink
					@height = @content_height
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
	// same as textarea height in global.stylus
	min-height 28.6875px
	line-height 1.1em
	padding 6px 10px 0 // padding-bottom:0 bc ff (stackoverflow.com/questions/24923424)

	// Allow scrolling but hide the scrollbar
	overflow auto
	-ms-overflow-style none
	scrollbar-width none
	&::-webkit-scrollbar
		display none
</style>