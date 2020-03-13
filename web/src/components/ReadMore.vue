<template lang="slm">
details
	summary
		div#summary-content.align-center
			slot name=summary
	div#details.fade-in
		slot
</template>

<script lang="coffee">

###
 * <details>-wrapper
###
export default Vue.extend
	name: 'ReadMore'
</script>

<style lang="stylus" scoped>
details
	// max-width 15%
	overflow hidden
	&[open]
	// 	width 85%
		overflow visible
		// max-width 80vw
		width fit-content !important
		max-width unset !important
		white-space pre-line
#details // todo rename
	margin-top 4px
	width fit-content
#details > *
	padding-left 2vw
summary
	white-space nowrap
#summary-content
	// float left
	display inline-flex
	margin-right 5px
</style>
