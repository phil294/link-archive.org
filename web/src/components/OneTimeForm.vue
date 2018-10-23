<template>
	<form @submit.prevent="submit">
		<slot />
		<one-time-button type="submit">{{ buttonLabel }}</one-time-button>
		<div class="error fade-in">{{ errorMessage }}</div>
	</form>
</template>

<script>
import OneTimeButton from '@/components/OneTimeButton';

/**
 * Standardform component: includes only submit (one-time-)button. Component fires $submit event and calls action callback like OneTimeButton.
 */
export default {
	name: 'OneTimeForm',
	components: { OneTimeButton },
	props: {
		buttonLabel: {
			type: String,
			default: 'Submit',
		},
		errorCaption: {
			type: String,
			default: 'Submit failed',
		},
		action: {
			type: Function,
			default: null,
		},
	},
	data: () => ({
		errorResponse: '',
	}),
	computed: {
		errorMessage() {
			return this.$data.errorResponse ? `${this.$data.errorCaption}: ${this.$data.errorResponse}` : '';
		},
	},
	methods: {
		async submit(event) {
			this.$data.loading = true;
			this.$data.errorResponse = '';
			this.$emit('submit', event);
			let { action } = this.$props;
			if (action) { // todo duplicate code
				if (typeof action === 'function')
					action = action(event);
				if (action instanceof Promise) {
					try {
						await action;
					} catch (error) {
						await this.$nextTick(); // force transition even if follow-up error // todo
						this.$data.errorResponse = error;
					} finally {
						this.$data.loading = false;
					}
				}
			}
		},
	},
};
</script>

<style scoped>
</style>
