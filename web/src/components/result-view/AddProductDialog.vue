<template lang="slm">
div
	promise-form :action=add_product
		label
			| Name
			input name=name placeholder=Name maxlength=255 minlength=3 required
		template #button_label Add product
</template>

<script lang="coffee">
export default Vue.extend
	name: 'AddProductDialog'
	methods: {
		...mapActions 'search',
			-	'add_product'
	}
</script>

<style lang="stylus" scoped>

</style>
