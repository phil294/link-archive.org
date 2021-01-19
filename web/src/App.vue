<template lang="slm">
section#app.column.fill-h
	no-ssr
		vue-progress-bar
	confirm
	popup v-if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal v-if=loading_counter
		.box.padding-l
			| Loading... ($loading_counter)
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
		div.error v-if=$errorHandler.error
			pre 500 | Internal Server Error :-( [{{$errorHandler.error.message}}]
		div.error.fade-in.column v-if=global_error_message
			pre $global_error_message
			div.center
				promise-button.btn :action=reset_global_error_message
					| Hide
		router-view
</template>

<script lang="coffee">
import Authenticate from '@/views/Authenticate'
import CategoryTree from '@/views/CategoryTree'
import Confirm from '@/views/Confirm'
import PathToCategory from '@/views/PathToCategory'
# TODO: requiring a seperate package for this is annoying, solve it manually somehow.
# v-if=!$isServer is not enough for vue-progress-bar
# https://github.com/egoist/vue-client-only/blob/master/src/index.js
import NoSsr from 'vue-no-ssr'
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	components: { NoSsr, Confirm, Authenticate, CategoryTree, PathToCategory }
	metaInfo:
		titleTemplate: (title) =>
			"#{if title then title+' – ' else ''}Site name"
		link:
			-	rel: 'manifest', href: '/manifest.json' # not actually necessary..? pwa seems to also work without the link
		meta:
			# -	name: 'description', vmid: 'description', content: 'Site description'
			-	name: 'theme-color', content: process.env.VUE_APP_THEME_PRIMARY_COLOR
	created: ->
		if @$isServer
			if @$errorHandler.error
				# Needs extra handling because the error-plugin only catches
				# *unexpected ssr renderer errors* outside fetch(). Here, we
				# consider errors that still allow a full page to be rendered
				# (500 status but no 500.html)
				{ ssr_build_error_report } = await import('@/server/error-plugin')
				await ssr_build_error_report @$errorHandler.error
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
