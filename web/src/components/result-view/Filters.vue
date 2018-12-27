<template lang="slm">
# :_='
div
	div.filters.flex.margin # todo no flex but line break
		div.filter.padding.margin each=filter
			span if=attributesById[filter.attributeId]
				| $attributesById[filter.attributeId].name
			span else
				| loading...
			| &nbsp; $conditionById[filter.condition].long
			span if=filter.conditionValue
				| &nbsp; $filter.conditionValue
			button @click=removeFilter(filter) 🗙
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
							select name=condition required model=conditionId
								option each=condition :value=condition.id html=conditionToOption(condition)
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
		conditionId: 'eq'
		conditions: [
				id: 'eq'
				abbr: '&nbsp;&equals;'
				needsValue: true
				long: 'is'
			,
				id: 'ne'
				abbr: '&excl;&equals;'
				long: 'not'
				needsValue: true
			,
				id: 'lt'
				abbr: '&nbsp;&lt'
				long: 'less than'
				needsValue: true
			,
				id: 'gt'
				abbr: '&nbsp;&gt'
				long: 'more than'
				needsValue: true
			,
				id: 'nu'
				abbr: '&nbsp;&#8709;'
				long: 'empty'
			,
				id: 'nn'
				abbr: '&excl;&#8709;'
				long: 'not empty'
		]
	methods: {
		...mapActions('search', [
			'removeFilter'
			'addFilter'
		])
		conditionToOption: condition ->
			option = condition.abbr
			if condition.needsValue
				option += " (#{condition.long})"
			option
	}
	computed: {
		...mapState('search', [
			'filters'
		])
		...mapGetters('search', [
			'attributeIds'
			'attributesById'
		])
		conditionById: -> @conditions.reduce((all, condition) =>
			all[condition.id] = condition
			all
		, {})
		conditionNeedsValue: ->
			@conditionById[@$data.conditionId].needsValue
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
		label
			text-align: center
		select
			width: 62px
			font-family: monospace
</style>
