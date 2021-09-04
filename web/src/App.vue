<template lang="slm">
div.fill.center.column.app
	.error.fade-in.padding-l v-if=global_error_message
		button.btn.margin @click="set_global_error_message('')" Hide
		pre $global_error_message
	strong.force-hidden Your browser is not working properly (CSS disabled)
	confirm
	popup v-if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ({{ loading_counter }})
	header.center.padding.fill-w
		nav
			router-link to=/ [LOGO]
		nav
			/ todo
			div v-if=is_logged_in
				| Logged in as 
				span v-if=session.name $session.name
				span v-else-if=session.email $session.email
				span v-else-if=session.external_type $session.external_identifier [$session.external_type]
				| . 
			router-link v-if=is_logged_in to=/settings Settings 
			button.btn v-if=is_logged_in @click=logout Logout
			button.btn v-if=!is_logged_in @click=show_authenticate_popup
				| Sign in
	main.flex-fill.column
		router-view
</template>

<script lang="coffee">
import Authenticate from '@/views/Authenticate'
import Confirm from '@/views/Confirm'
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	components: { Confirm, Authenticate }
	computed: {
		...mapState [
			'app_name'
			'loading_counter'
			'authenticate_popup'
			'global_error_message'
		]
		...mapState 'session', [
			'session'
		]
		...mapGetters 'session', [
			'is_logged_in'
		]
	}
	methods: {
		...mapActions [
			'hide_authenticate_popup'
			'show_authenticate_popup'
			'set_global_error_message'
		]
		...mapActions 'session', [
			'logout'
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
		.session-info
			.logged-in-prompt
				@media (max-width: 600px)
					display none
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
