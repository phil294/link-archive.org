<template lang="slm">
# :_='
token-input :token=$route.query.token @success=redirect
# '
</template>

<script lang="coffee">
import Vue from 'vue'
### Route '/logincallback': "Callback" handler for email links, google and alike. ###
export default Vue.extend
	name: 'LoginCallbackHandler'
	created: ->
		this.$store.dispatch 'hide_authenticate_popup' # in case user entered the link manually while having login modal open
	methods:
		redirect: ->
			this.$router.push '/'
</script>

<style lang="stylus" scoped>
</style>
