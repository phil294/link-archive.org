<template>
	<form @submit.prevent="submit">
		<slot />
		<progress-button ref="submit" type="submit" :set-loading-automatically="false">{{ buttonLabel }}</progress-button> <!-- TODO :disabled="!formModel.isValid" how to? -->
		<div class="error fade-in">{{ errorMessage }}</div>
	</form>
</template>

<script>
import ProgressButton from '@/components/ProgressButton';

/**
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button`.
 */
export default {
	name: 'PromiseForm',
	components: { ProgressButton },
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
			required: true, // todo
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
			this.$data.errorResponse = '';
			this.$refs.submit.setLoading();
			this.$emit('submit', event);
			try {
				await this.$props.action(event);
			} catch (error) {
				await this.$nextTick(); // force transition even if follow-up error // todo
				this.$data.errorResponse = error;
			} finally {
				if (this.$refs.submit) // component still alive
					this.$refs.submit.reset();
			}
		},
	},
};
</script>

<style scoped>
</style>
