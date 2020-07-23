<template lang="slm">
modal @close=close
	main.box.column ref=main
		header
			div.titlebar.center v-moveable="{move_target}"
				| ⠿⠿⠿⠿⠿
			button.close @click=close type=button ╳
		.popup-content v-dragscrollable=""
			/ FIXME: Only on mobile, same as result table handles, via css
			slot
</template>

<script lang="coffee">
export default
	name: 'Popup'
	data: ->
		move_target: null
	methods:
		close: ->
			@$store.dispatch 'offer_focus'
			@$emit 'close'
	mounted: ->
		@move_target = @$refs.main
</script>

<style lang="stylus" scoped>
main
	max-height 98vh
	max-width 98vw
	min-width 50px
	min-height 50px
	position relative
	box-sizing border-box
	overflow auto
	resize both
.titlebar, .close
	line-height 2em
	margin-top 1vmax
.close
	position absolute
	top 0
	right 1.5vmax
.popup-content
	padding 0 3vmax 3vmax
	overflow auto
</style>
