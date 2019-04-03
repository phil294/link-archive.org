<template lang="slm">
modal @close=close
	main.box.padding-xl
		button#close.btn type=button @click=close 🗙
		slot
</template>

<script lang="coffee">
import Vue from 'vue'

export default Vue.extend
	name: 'Popup'
	methods:
		close: -> @$emit 'close'
</script>

<style lang="stylus" scoped>
main
	max-width 400px
	max-height 100%
	overflow auto
	box-sizing border-box
	position relative
#close
	position absolute
	top 0
	right 0
</style>
