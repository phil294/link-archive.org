<template lang="slm">
# :_='
div
	div.filters.flex.margin # todo no flex but line break
		div.filter.padding.margin each=filter
			span if=attributesById[filter.attributeId]
				| $attributesById[filter.attributeId].name
			span else
				| loading...
			span $filter.condition
			span $filter.conditionValue
			button @click=removeFilter(filter) x
	div
		button if=!showForm @click=showForm=true
			| +
		button else @click=showForm=false
			| -
		div.center.margin-l
			promise-form#form.box.padding-xl if=showForm button-label="Add" :action=addFilter button-float-right
				div.flex
					div.attribute-select.padding
						label
							| Attribute
							attribute-select name=attributeId required :attribute-ids=attributeIds
					div.condition.padding
						label
							| Condition
							select name=condition required model=condition
								option value=eq &equals;
								option value=ne !&equals; (is not)
								option value=lt &lt; (is less than...)
								option value=gt &gt; (is more than...)
								option value=nu is empty
								option value=nn is not empty
					div.condition-value.padding
						label if=conditionNeedsValue
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
		condition: 'eq' # Yes, a string. Not a constant. Deal with it.
	methods: {
		...mapActions('search', [
			'removeFilter'
			'addFilter'
		])
	}
	computed: {
		...mapState('search', [
			'filters'
		])
		...mapGetters('search', [
			'attributeIds'
			'attributesById'
		])
		conditionNeedsValue: ->
			!['nu', 'nn'].includes(@$data.condition)
	}
)
</script>

<style lang="stylus" scoped>
.filter
	background: lightgrey
#form
	max-width: 750px
	.attribute-select, .condition-value
		flex: 2
	.condition
		flex: 1
		min-width: 100px
</style>
