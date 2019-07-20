<template lang="slm">
div
	h5
		| $product.name: $attribute.name
	promise-form :action=save_datum
		label
			| Value
			input name=value placeholder=Value required
		label
			| Source
			input name=source placeholder=Source required
</template>

<script lang="coffee">
export default Vue.extend
	name: 'EditDatumDialog'
	props:
		product:
			type: Object
			required: true
		attribute_id:
			type: String
			required: true
	methods: {
		...mapActions 'search',
			-	'add_product'
		save_datum: ({ form_data }) ->
			@$store.dispatch 'search/save_datum',
				form_data: form_data
				product: @product
				attribute_id: @attribute_id
	}
	computed: {
		...mapGetters 'search',
			-	'attributes_by_id'
		attribute: ->
			@attributes_by_id[@attribute_id]
		datum: ->
			@product.data[@attribute_id] || {}
	}
</script>

<style lang="stylus" scoped>

</style>
