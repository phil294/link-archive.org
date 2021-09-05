<template lang="slm">
div.click-to-interact @mouseleave=on_mouseleave
	.overlay.do-not-print v-if=show_overlay @click=on_overlay_click @wheel=on_overlay_wheel :class.show_hover_text=overlay_show_hover_text
	slot
</template>

<script lang="coffee">
export default
	data: ->
		show_overlay: true
		overlay_show_hover_text: false
	methods:
		on_overlay_click: ->
			@show_overlay = false
		on_overlay_wheel: ->
			@overlay_show_hover_text = true
		on_mouseleave: ->
			@show_overlay = true
			@overlay_show_hover_text = false
</script>

<style lang="stylus" scoped>
.click-to-interact
	position relative
	// overflow auto
	.overlay
		position absolute
		inset 0
		background rgba(0,0,0,0.07)
		cursor pointer
		z-index 401 // min 401 because ef2/leaflet
		&.show_hover_text:hover::after
			content 'Click to interact'
			position absolute
			inset 0
			text-align center
			padding 1em
			background rgba(0,0,0,0.2)
			color white
			font-weight bold
			font-size 170%
</style>
