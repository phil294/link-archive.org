<template lang="slm">
# :_='
div
	div.filters
		div.filter.padding.margin each=filter
			strong  $conditionById[filter.condition].long
			span if=filter.conditionValue
				|  $filter.conditionValue
			button @click=removeFilter(filter) 🗙
	div.center
		button if=!showForm @click=showForm=true
			| +
		button else @click=showForm=false
			| -
		div.center.margin if=showForm
			promise-form#form.box.padding-xl button-label="Add" :action=addFilter button-float-right
				div.flex
					div.attribute-select.padding if=!attributeId
						label.column
							| Attribute
							attribute-select name=attributeId required :attribute-ids=attributeIds
					input else type=hidden name=attributeId :value=attributeId
					div.condition.padding
						label.column
							| Condition
							select name=condition required model=conditionId
								option each=condition :value=condition.id html=conditionToOption(condition)
					div.condition-value.padding
						label.column if=conditionNeedsValue
							| Value
							input name=conditionValue required
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default Vue.extend(
	name: 'ResultTableFilters'
	props:
		filters:
			type: Array
			required: true
		attributeId:
			type: String
			default: ''
	data: ->
		showForm: false
		conditionId: 'eq'
		conditions: [
				id: 'eq'
				abbr: '&nbsp;&equals;'
				needsValue: true
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
			option = "#{condition.abbr} (is"
			if condition.long
				option += " #{condition.long}"
			if condition.needsValue
				option += '...'
			option += ')'
			option
	}
	computed: {
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
	.condition-value
		input
			width: 130px
</style>
