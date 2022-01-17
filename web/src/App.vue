<template lang="slm">
div.fill.center.column.app
	.error.center.column.fade-in.padding-l.fill-w v-if=global_error_message
		pre.fill-w $global_error_message
		button.btn.margin @click="set_global_error_message('')" Hide
	strong.force-hidden Your browser is not working properly (CSS disabled)
	confirm
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ({{ loading_counter }})
	/ header.center.padding.fill-w
		nav
			router-link to=/ [LOGO]
	main.flex-fill.fill-w.column
		.view-wrapper.column
			router-view
</template>

<script lang="coffee">
import Confirm from '@/views/Confirm'
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	components: { Confirm }
	computed: {
		...mapState [
			'app_name'
			'loading_counter'
			'global_error_message'
		]
	}
	methods: {
		...mapActions [
			'set_global_error_message'
		]
	}
</script>

<style lang="stylus" scoped>
.app
	> header
		border-bottom 1px solid lightgrey
		justify-content space-between
		// nav:not(:last-child), nav > *:not(:last-child) // TODO
		// 	margin-right 1.5vw
		button
			padding 1px 4px
	.error pre
		word-break break-word
		white-space pre-line
a.router-link-active
	font-weight bold
main
	overflow: auto // FF
.view-wrapper
	margin 0 auto
</style>

<style lang="stylus" src="./global.stylus"></style>
