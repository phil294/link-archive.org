<template lang="slm">
.resizable ref=resizable_ref
	slot
	.resize v-for="direction of ['n','e','s','w']" :class=direction @mousedown="start_resize(direction,$event)" @touchstart="start_resize(direction,$event)"
</template>

<script lang="coffee">
export default
	emits: [ 'start_resize', 'end_resize' ]
	data: ->
		direction: ''
		offset: 0
		mouse_start: {}
		dimensions_start: {}
	methods:
		start_resize: (direction, event) ->
			event.preventDefault()
			@$emit 'start_resize'
			@direction = direction
			@offset = 0
			# This code is similar to moveable.coffee and it would have become a v-directive
			# if the extra .resize html elements weren't necessary
			@mouse_start = { x: event.pageX or event.changedTouches[0].pageX, y: event.pageY or event.changedTouches[0].pageY }
			@dimensions_start =
				width: @$el.offsetWidth
				height: @$el.offsetHeight
			document.addEventListener 'mousemove', @do_resize
			document.addEventListener 'mouseup', @end_resize
			document.addEventListener 'touchmove', @do_resize
			document.addEventListener 'touchend', @end_resize
		end_resize: ->
			event.preventDefault()
			document.removeEventListener 'mousemove', @do_resize
			document.removeEventListener 'mouseup', @end_resize
			document.removeEventListener 'touchmove', @do_resize
			document.removeEventListener 'touchend', @end_resize
			@$emit 'end_resize',
				direction: @direction
				offset: @offset
				element: @$el
			@$el.style.height = ''
			@$el.style.width = ''
			@$el.style.top = ''
			@$el.style.left = ''
		do_resize: (event) ->
			event.preventDefault()
			pageX = event.pageX or event.changedTouches[0].pageX
			pageY = event.pageY or event.changedTouches[0].pageY
			switch @direction
				when 'n'
					@offset = pageY - @mouse_start.y
					@$el.style.top = @offset + "px"
					@$el.style.height = @dimensions_start.height - @offset + "px"
				when 'e'
					@offset = pageX - @mouse_start.x
					@$el.style.width = @dimensions_start.width + @offset + "px"
				when 's'
					@offset = pageY - @mouse_start.y
					@$el.style.height = @dimensions_start.height + @offset + "px"
				when 'w'
					@offset = pageX - @mouse_start.x
					@$el.style.left = @offset + "px"
					@$el.style.width = @dimensions_start.width - @offset + "px"
</script>

<style lang="stylus" scoped>
.resizable
	position relative
.resize
	position absolute
	z-index 400 // leaflet
	&.n, &.s
		cursor row-resize
		left 0
		right 0
		height 8px
	&.n
		top 0
		height 5px
	&.s
		bottom 0
	&.w, &.e
		cursor col-resize
		width 8px
		top 0
		bottom 0
	&.e
		right 0
</style>