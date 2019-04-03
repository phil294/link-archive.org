<template lang="slm">
details
	summary $summary
	div#details
		slot
</template>

<script lang="coffee">
import Vue from 'vue'

###
 * <details>-wrapper
###
export default Vue.extend
	name: 'ReadMore'
	props:
		summary:
			type: String
			default: 'Read more'
			required: true
</script>

<style lang="stylus" scoped>
details
	padding 8px
#details > *
	padding-left 2vw
</style>
