<template lang="slm">
# :_='
div
	h1 Settings
	promise-button :action=invalidate_all_tokens :reset_after_success=false Log out everywhere
	read-more.note summary=`How does this work?`
		| All login links that exist will be invalidated. In order to log in again on other devices, you need to request a new login mail. Yet you will stay logged in in this browser until you log out.
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend
	name: 'Settings'
	methods: {
		...mapActions 'session',
			-	'invalidate_all_tokens'
	}
</script>

<style lang="stylus" scoped>
</style>
