<template>
	<form @submit.prevent="submit">
		<slot />
		<progress-button ref="submit" type="submit" :set-loading-automatically="false">{{ buttonLabel }}</progress-button>
		<div v-if="errorMessage" class="error fade-in">{{ errorMessage }}</div>
	</form>
</template>

<script>
import Vue from 'vue';
import ProgressButton from '@/components/ProgressButton';

/**
 * Standardform component: includes only submit (progress-)button.
 * Component fires $submit event and calls `action` prop just
 * like `promise-button`.
 */
export default Vue.extend({
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
			required: true,
		},
	},
	data: () => ({
		errorResponse: '',
	}),
	computed: {
		errorMessage() {
			return this.$data.errorResponse ? `${this.$props.errorCaption}: ${this.$data.errorResponse}` : '';
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
				await this.$nextTick(); // enforce transition event even if follow-up error
				this.$data.errorResponse = error;
			} finally {
				if (this.$refs.submit) // component still alive?
					this.$refs.submit.reset();
			}
		},
	},
});
</script>

<style scoped>
</style>
