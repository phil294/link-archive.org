<template lang="slm">
div
	h5
		| $product.name: $attribute.name ( $attribute.type ) $attribute.float
	promise-form :action=save_datum
		label if="attribute.type==='string'"
			| Value
			input name=value placeholder=Value required
		label else-if="attribute.type==='number'"
			| Amount 
			small \[in {{attribute.unit}}] # fixme syntax
			input type=number name=value :placeholder="'Amount [in '+attribute.unit+']'" :step="attribute.float? 'any' : 1" :min="attribute.min" :max="attribute.max" required
		label else-if="attribute.type==='boolean'"
			input type=checkbox name=value
			| Active
		label
			| Source
			input type=url name=source placeholder=Source required
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
