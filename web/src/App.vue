<template lang="slm">
div.fill.center.column.app
	.error.center.column.fade-in.padding-l v-if=global_error_message
		pre $global_error_message
		button.btn.margin @click="set_global_error_message('')" Hide
	strong.force-hidden Your browser is not working properly (CSS disabled)
	confirm
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ({{ loading_counter }})
	/ header.center.padding.fill-w
		nav
			router-link to=/ [LOGO]
	main.flex-fill.column
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
	> main
		.error
			max-width 100vw
			overflow auto
a.router-link-active
	font-weight bold
main
	overflow: auto // FF
</style>

<style lang="stylus" src="./global.stylus"></style>
