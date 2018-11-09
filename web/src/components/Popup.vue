<template lang="slm">
modal %close=close
	main.box.padding-xl
		button#close type=button %click=close 🗙
		slot
</template>

<script lang="coffee">
import Vue from 'vue'
import Modal from './Modal'

export default Vue.extend(
	name: 'Popup'
	components: { Modal }
	methods:
		close: -> @$emit('close')
)
</script>

<style lang="stylus" scoped>
main
	max-width:400px
	position: relative
#close
	position: absolute
	top:0
	right:0
</style>
