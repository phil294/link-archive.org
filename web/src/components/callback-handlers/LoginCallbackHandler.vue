<template>
	<token-input :token="$route.query.token" @success="redirect()" />
</template>

<script>
import TokenInput from '@/components/TokenInput';

/** Route '/logincallback': "Callback" handler for email links, google and alike. */
export default {
	name: 'LoginCallbackHandler',
	components: {
		TokenInput,
	},
	created() {
		this.$store.dispatch('hideAuthenticateModal'); // in case user entered the link manually while having login modal open
	},
	methods: {
		redirect() {
			this.$router.push('/');
		},
	},
};
</script>

<style scoped>
</style>
