<template lang="slm">
section#app.column.fill-h
	popup v-if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ($loading_counter)
	header.center.padding
		nav
			router-link exact="" to=/ [LOGO]
			router-link exact="" to=/p search result
		nav
			/ todo
			div v-if=is_logged_in
				| Logged in as 
				span v-if=session.name $session.name
				span v-else-if=session.email $session.email
				span v-else-if=session.external_type $session.external_identifier [$session.external_type]
			router-link v-if=is_logged_in exact="" to=/settings Settings
			button.btn v-if=is_logged_in @click=logout Logout
			button.btn v-if=!is_logged_in @click=show_authenticate_popup
				| Sign in
	main.flex-fill.column
		p.center.error.fade-in v-if=global_error_message $global_error_message
		router-view
		strong.warn.force-hidden Your browser is not working properly (CSS disabled)
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import Authenticate from '@/components/Authenticate'

if window # todo if ssr
	window.Vue = Vue
	window.mapActions = mapActions
	window.mapState = mapState
	window.mapGetters = mapGetters

export default
	components: { Authenticate }
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
