<template lang="slm">
modal @close=close
	main.box.padding-xl ref=main
		/ FIXME: Only on mobile, same as result table handles, via css
		div#titlebar.center v-moveable="{parent:true}"
			| ⠿⠿⠿⠿⠿
		button#close @click=close ╳
		slot
</template>

<script lang="coffee">
export default
	name: 'Popup'
	methods:
		close: ->
			@$store.dispatch 'offer_focus'
			@$emit 'close'
</script>

<style lang="stylus" scoped>
main
	max-height 98vh
	min-width 50px
	min-height 50px
	position relative
	overflow auto
	box-sizing border-box
	resize both
#titlebar, #close
	position absolute
	line-height 1em
	top 1.5vmax
#close, #titlebar
	right 1.5vmax
#titlebar
	left 1.5vmax
	color var(--color-border)
	user-select none
</style>
