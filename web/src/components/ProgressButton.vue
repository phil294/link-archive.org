<template>
	<button :disabled="loading || disabled" :type="type" @click="clicked">
		<slot v-if="!loading">Click me</slot>
		<span v-else>loading...</span>
	</button>
</template>

<script>
/**
 * Button that, when clicked, replaces itself with a loading animation
 * and fires $click-event.
 * Alternatively, call .setLoading() and .reset() manually and disable
 * automatic loading state with setLoadingAutomatically=false.
 */
export default {
	name: 'ProgressButton',
	props: {
		type: {
			type: String,
			default: 'button',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		setLoadingAutomatically: {
			type: Boolean,
			default: true,
		},
	},
	data: () => ({
		loading: false,
	}),
	methods: {
		async clicked() {
			if (this.$props.setLoadingAutomatically)
				this.$data.loading = true;
			this.$emit('click');
		},
		/** Consider using a normal button instead */
		reset() {
			this.$data.loading = false;
		},
		setLoading() {
			this.$data.loading = true;
		},
	},
};
</script>

<style scoped>
</style>
