<template lang="slm">
# :_='
div
	h6
		| $product.name: $attribute.name
	promise-form :action=saveDatum
		label for=value Value
		input#value name=value placeholder=Value required
		label for=source Source
		input#source name=source placeholder=Source required
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'EditDatumDialog'
	props:
		product:
			type: Object
			required: true
		attributeId:
			type: Number
			required: true
	methods: {
		...mapActions('search', [
			'addProduct'
		])
		saveDatum: formData ->
			@$store.dispatch('search/saveDatum', {
				formData,
				productId: @product.id
				attributeId: @attributeId
			})
	}
	computed: {
		...mapGetters('search', [
			'attributesById'
		])
		attribute: ->
			@attributesById[@attributeId]
		datum: ->
			@product.data[@attributeId] || {}
	}
)
</script>

<style lang="stylus" scoped>

</style>
