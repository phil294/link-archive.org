<template lang="slm">
	div#background.fill @click=close
	slot
</template>

<script lang="coffee">
export default Vue.extend
	name: 'Modal'
	props:
		contained:
			type: Boolean
			default: false
	methods:
		close: -> @$emit 'close'
	mounted: ->
		if not @contained
			@$refs.modal.focus()
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
	&.contained
		position absolute
		box-shadow inset 0 0 8px 5px white
#background
	position absolute
</style>
