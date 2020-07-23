<template lang="slm">
details
	summary :class.no-list-style=noliststyle
		div#summary-content.align-center.fill
			slot name=summary
				small Details
	div#details.fade-in
		slot
</template>

<script lang="coffee">

###
 * <details>-wrapper
###
export default
	name: 'ReadMore'
	props:
		noliststyle:
			default: false
			type: Boolean
</script>

<style lang="stylus" scoped>
details
	overflow hidden
	&[open]
		overflow visible
		white-space pre-line
#details > *
	padding-left 2vw
summary
	white-space nowrap
	&.no-list-style
		list-style none
		&::-webkit-details-marker
			display none
#summary-content
	display inline-flex
</style>
