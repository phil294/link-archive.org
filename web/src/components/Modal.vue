<template lang="slm">
# :_='
div#modal.center.fade-in @keyup.esc=close tabindex=-1 ref=modal # todo use <dialog> as soon as it is supported everywhere
	div#background.fill @click=close
	slot
# '
</template>

<script lang="coffee">
import Vue from 'vue'

export default Vue.extend(
	name: 'Modal'
	methods:
		close: -> @$emit('close')
	mounted: ->
		@$refs.modal.focus()
)
</script>

<style lang="stylus" scoped>
#modal // todo styling host el?
	position fixed
	top 0
	left 0
	bottom 0
	right 0
	z-index 999
	box-sizing border-box
	background rgba(0,0,0,0.08)
#background
	position absolute
</style>
