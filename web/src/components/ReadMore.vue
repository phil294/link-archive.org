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
/**
 * <details>-wrapper
 */
export default {
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
};
</script>

<style scoped>
#details > * {
	padding-left: 2vw;
}
</style>
