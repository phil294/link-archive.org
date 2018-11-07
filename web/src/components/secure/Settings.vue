<template lang="slm">
	div
		h1 Settings
		promise-button -action=invalidateAllTokens Log out everywhere
		read-more.note summary="How does this work?"
			| All login links that exist will be invalidated. In order to log in again on other devices, you need to request a new login mail. Yet you will stay logged in in this browser until you log out.
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import PromiseButton from '@/components/PromiseButton'
import ReadMore from '@/components/ReadMore'

export default Vue.extend(
	name: 'Settings'
	components: { PromiseButton, ReadMore }
	methods: {
		...mapActions('session', [
			'invalidateAllTokens'
		])
	}
)
</script>

<style lang="stylus" scoped>
</style>
