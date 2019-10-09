<template lang="slm">
details
	summary
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
#details
	margin-top 4px
#details > *
	padding-left 2vw
summary
	white-space nowrap
</style>
