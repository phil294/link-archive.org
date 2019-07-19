<template lang="slm">
section#app.column.fill-h
	popup if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal if=loading_counter
		.box.padding-l
			| Loading... ($loading_counter)
	header.center.padding
		nav
			router-link exact to=/ [LOGO]
		nav
			div if=is_logged_in # todo
				| Logged in as 
				span if=session.name $session.name
				span else-if=session.email $session.email
				span else-if=session.external_type $session.external_identifier [$session.external_type]
			router-link if=is_logged_in exact to=/settings Settings
			button.btn if=is_logged_in @click=logout Logout
			button.btn if=!is_logged_in @click=show_authenticate_popup
				| Sign in
	main.flex-fill.column
		p.center.error if=global_error_message $global_error_message
		router-view
</template>

<script lang="coffee">
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	name: 'App'
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
		...mapActions 'session',
			-	'logout'
	}
</script>

<style lang="stylus" scoped>
#app > header
	border-bottom 1px solid lightgrey
	justify-content space-between
	nav > *:not(:last-child)
		margin-right 1.5em
		display inline
a.router-link-active
	font-weight bold
main
	overflow: auto // FF
</style>

<style lang="stylus" src="./global.stylus"></style>
