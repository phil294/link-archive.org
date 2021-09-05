<template lang="slm">
section#app.column.fill-h
	confirm
	popup v-if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ({{ loading_counter }})
	header.center.padding
		nav
			router-link exact="" to=/ [LOGO]
		nav
			/ todo
			div v-if=is_logged_in
				| Logged in as 
				span v-if=session.name $session.name
				span v-else-if=session.email $session.email
				span v-else-if=session.external_type $session.external_identifier [$session.external_type]
				| . 
			router-link v-if=is_logged_in exact="" to=/settings Settings 
			button.btn v-if=is_logged_in @click=logout Logout
			button.btn v-if=!is_logged_in @click=show_authenticate_popup
				| Sign in
	main.flex-fill.column
		div.error.fade-in.column v-if=global_error_message
			pre $global_error_message
			div.center
				promise-button.btn :action=reset_global_error_message
					| Hide
		router-view
</template>

<script lang="coffee">
import Authenticate from '@/views/Authenticate'
import Confirm from '@/views/Confirm'
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	components: { Confirm, Authenticate }
	computed: {
		...mapState
			-	'app_name'
			-	'loading_counter'
			-	'authenticate_popup'
			-	'global_error_message'
		...mapState 'session',
			-	'session'
		...mapGetters 'session',
			-	'is_logged_in'
	}
	methods: {
		...mapActions
			-	'hide_authenticate_popup'
			-	'show_authenticate_popup'
			-	'reset_global_error_message'
		...mapActions 'session',
			-	'logout'
	}
</script>

<style lang="stylus" scoped>
#app
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
