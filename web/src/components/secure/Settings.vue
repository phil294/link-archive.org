<template lang="slm">
div
	h1 Settings
	promise-button :action=invalidate_all_tokens :reset_after_success=false
		| Log out everywhere
	small
		read-more
			template #summary How does this work?
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
