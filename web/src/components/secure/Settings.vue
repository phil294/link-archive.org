<template lang="slm">
div
	h2 Settings
	promise-button.btn onetime="" :action=invalidate_all_tokens
		| Log out everywhere
	small
		read-more
			template #summary="" How does this work?
			| All existing sessions (tokens) will be invalidated, effectively logging you out everywhere. Yet you will stay logged in in this browser until you log out explicitly.
</template>

<script lang="coffee">
export default Vue.extend
	name: 'Settings'
	methods: {
		...mapActions 'session',
			-	'invalidate_all_tokens'
	}
</script>

<style lang="stylus" scoped>
</style>
