<template lang="slm">
token-input :token=$route.query.token @success=redirect
</template>

<script lang="coffee">
### Route '/logincallback': "Callback" handler for email links, google and alike. ###
import TokenInput from '@/components/TokenInput'
export default Vue.extend
	components: { TokenInput }
	name: 'LoginCallbackHandler'
	created: ->
		this.$store.dispatch 'hide_authenticate_popup' # in case user entered the link manually while having login modal open
	methods:
		redirect: ->
			this.$router.push '/'
</script>

<style lang="stylus" scoped>
</style>
