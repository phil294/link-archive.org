<template lang="slm">
	token-input -token=$route.query.token %success=redirect
</template>

<script lang="coffee">
import Vue from 'vue'
import TokenInput from '@/components/TokenInput'

# Route '/logincallback': "Callback" handler for email links, google and alike.
export default Vue.extend
	name: 'LoginCallbackHandler'
	components: { TokenInput }
	created: ->
		this.$store.dispatch 'hideAuthenticateModal' # in case user entered the link manually while having login modal open
	methods:
		redirect: ->
			this.$router.push '/'
</script>

<style scoped>
</style>
