<template>
	<details>
		<summary>
			{{ summary }}
		</summary>
		<div id="details">
			<slot />
		</div>
	</details>
</template>

<script>
import Vue from 'vue';

/**
 * <details>-wrapper
 */
export default Vue.extend({
	name: 'ReadMore',
	props: {
		summary: {
			type: String,
			default: 'Read more',
			required: true,
		},
	},
	data: () => ({
	}),
	methods: {

	},
});
</script>

<style scoped>
#details > * {
	padding-left: 2vw;
}
</style>
