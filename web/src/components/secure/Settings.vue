<template lang="slm">
	div
		h1 Settings
		promise-button -action=invalidateAllTokens log out everywhere invalidate all login links
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import PromiseButton from '@/components/PromiseButton'

export default Vue.extend(
	name: 'Settings'
	methods: {
		...mapActions('session', [
			'invalidateAllTokens'
		])
	}
)
</script>

<style lang="stylus" scoped>
</style>
