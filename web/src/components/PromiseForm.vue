<template>
	<form @submit.prevent="submit">
		<slot></slot>
		<one-time-button ref="submit" type="submit">{{ buttonLabel }}</one-time-button>
		<div class="error fade-in">{{ errorMessage }}</div>
	</form>
</template>

<script>
/**
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
			required: true,
		},
	},
	data: () => ({
		errorResponse: '',
	}),
	methods: {
		async submit(event) {
			this.$data.errorResponse = '';
			this.$emit('submit', event);
			try {
				await action(event);
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
			return `${this.$data.errorCaption}: ${errorResponse}`;
		}
	}
};
</script>

<style scoped>
</style>
