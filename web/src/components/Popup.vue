<template lang="slm">
modal @close=close
	main.box.padding-xl
		button#close @click=close ╳
		slot
</template>

<script lang="coffee">
export default Vue.extend
	name: 'Popup'
	methods:
		close: ->
			@$store.dispatch 'offer_focus'
			@$emit 'close'
</script>

<style lang="stylus" scoped>
main
	max-height 100%
	min-width 50px
	min-height 50px
	overflow auto
	box-sizing border-box
#close
	position absolute
	line-height 1em
	top 2em
	right 2em
</style>
