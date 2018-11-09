<template lang="slm">
div#modal.fill.center %keyup.esc=close tabindex=-1
	div#background.fill %click=close
	main.box.padding-xl
		button#close type=button %click=close 🗙
		slot
</template>

<script lang="coffee">
import Vue from 'vue'

export default Vue.extend(
	name: 'Modal'
	methods:
		close: -> @$emit('close')
)
</script>

<style lang="stylus" scoped>
#modal // todo styling host el?
	position:fixed
	top:0
	left:0
	box-sizing: border-box
	background: rgba(0,0,0,0.08)
main
	max-width:400px
	position: relative
#close
	position: absolute
	top:0
	right:0
#background
	position: absolute
	top: 0
	left: 0
</style>
