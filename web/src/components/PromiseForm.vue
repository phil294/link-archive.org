<template>
	<form @submit.prevent="submit">
		<slot></slot>
		<progress-button ref="submit" type="submit" :setLoadingAutomatically="false">{{ buttonLabel }}</progress-button> <!-- TODO :disabled="!formModel.isValid" how to? -->
		<div class="error fade-in">{{ errorMessage }}</div>
	</form>
</template>

<script>
import ProgressButton from '@/components/ProgressButton';

/** todo
 * Standardform component: includes only submit (one-time-)button. Component fires $submit event and calls action callback like OneTimeButton. todo
 */
export default {
	name: 'PromiseForm',
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
	components: { ProgressButton },
	data: () => ({
		errorResponse: '',
	}),
	methods: {
		async submit(event) {
			this.$data.errorResponse = '';
			this.$refs.submit.setLoading();
			this.$emit('submit', event);
			try {
				await this.$props.action(event);
			} catch(error) {
				await this.$nextTick(); // force transition even if follow-up error // todo
				this.$data.errorResponse = error;
			} finally {
				this.$refs.submit.reset();
			}
		},
	},
	computed: {
		errorMessage() {
			return this.$data.errorResponse ? `${this.$data.errorCaption}: ${this.$data.errorResponse}` : '';
		}
	}
};
</script>

<style scoped>
</style>
