<template lang="slm">
details
	summary $summary
	div#details
		slot
</template>

<script lang="coffee">

###
 * <details>-wrapper
###
export default Vue.extend
	name: 'ReadMore'
	props:
		summary:
			type: String
			required: true
</script>

<style lang="stylus" scoped>
details
	padding 8px
#details > *
	padding-left 2vw
</style>
