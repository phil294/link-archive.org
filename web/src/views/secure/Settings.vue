<template lang="slm">
section#settings.padding-l.column.center
	h2 Settings
	div
		promise-button.btn onetime="" :action=invalidate_all_tokens
			| Log out everywhere
		read-more
			| All existing sessions (tokens) will be invalidated, effectively logging you out everywhere. Yet you will stay logged in in this browser until you log out explicitly.
	fieldset
		legend Delete your account
		promise-form.danger :action=delete_account
			label.row
				input type=checkbox required=""
				| Confirm deletion
			read-more
				p This action will log you out and remove your user details from the system without trace.
				p Next time you log in, the acount will be created anew.
			template #button_label="" Delete your account
</template>

<script lang="coffee">
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	name: 'Settings'
	methods: {
		...mapActions 'session',
			-	'invalidate_all_tokens'
		delete_account: ->
			if not await @$store.dispatch 'confirm_ask', 'Are you sure you want to delete your account?'
				return
			await @$store.dispatch 'session/delete_account'
			@$router.push '/'
	}
</script>

<style lang="stylus" scoped>
#settings
	> *
		margin-bottom 2vh
</style>
