<template lang="slm">
# :_='
div
	div.filters.flex.margin
		div.filter.padding.margin each=filter
			span $attributesById[filter.attributeId].name
			span $filter.condition
			span $filter.conditionValue
			button @click=removeFilter(filter) x
	div 
		button if=!showForm @click=showForm=true
			| +
		button else @click=showForm=false
			| -
		promise-form if=showForm button-label="Add" :action=addFilter :fields=fields
			label
				| Attribute ID
				input name=attributeId required
			label
				| Condition
				input name=condition required placeholder=eq
			label
				| Value
				input name=conditionValue required
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultViewFilters'
	data: ->
		showForm: false
	methods: {
		...mapActions('search', [
			'removeFilter'
		])
		addFilter: ({ values }) ->
			@$store.dispatch('search/addFilter', values)
	}
	computed: {
		...mapState('search', [
			'filters'
		])
		...mapGetters('search', [
			'attributesById'
			'availableAttributeIds'
		])
	}
)
</script>

<style lang="stylus" scoped>
.filter
	background: lightgrey
</style>
