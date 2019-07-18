<template lang="slm">
div
	div.filters.justify-center
		div.filter.box each=filter
			span $condition_by_id[filter.condition].long&nbsp;
			strong if=filter.condition_value
				| $filter.condition_value&nbsp;
			button @click=remove_filter(filter) if=!readonly × # 🗙
		label.justify-center if="!show_form && !readonly"
			span.disabled if=!filters.length Add filter&nbsp;
			button.disabled.fade-in @click=show_form=true
				| +
	div.center.column
		popup if=show_form @close=show_form=false
			promise-form#form :action=add_filter button_float_right
				div.flex
					div.attribute-select.padding if=!attribute_id # todo currently unused
						label.column
							| Attribute
							attribute-select name=attribute_id required :attribute_ids=attribute_ids
					input else type=hidden name=attribute_id :value=attribute_id
					div.condition.padding
						label.column
							| Condition
							select name=condition required model=condition_id
								option each=condition :value=condition.id html=condition_to_option(condition) # todo why html not | ?
					div.condition-value.padding
						label.column if=condition_needs_value
							| Value
							input name=condition_value required
				template #button_label Add
				
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default Vue.extend
	name: 'ResultTableFilters'
	props:
		filters:
			type: Array
			required: true
		attribute_id:
			type: String
			default: ''
		readonly:
			default: false
	data: ->
		show_form: false
		condition_id: 'eq'
		conditions:
			-	id: 'eq'
				abbr: '&nbsp;&equals;'
				needs_value: true
			-	id: 'ne'
				abbr: '&excl;&equals;'
				long: 'not'
				needs_value: true
			-	id: 'lt'
				abbr: '&nbsp;&lt'
				long: 'less than'
				needs_value: true
			-	id: 'gt'
				abbr: '&nbsp;&gt'
				long: 'more than'
				needs_value: true
			-	id: 'nu'
				abbr: '&nbsp;&#8709;' # todo symbol
				long: 'empty'
			-	id: 'nn'
				abbr: '&excl;&#8709;' # .
				long: 'not empty'
				# todo: contains, regex
	methods: {
		...mapActions 'search',
			-	'remove_filter'
			-	'add_filter'
		condition_to_option: condition ->
			option = "#{condition.abbr} (is"
			if condition.long
				option += " #{condition.long}"
			if condition.needs_value
				option += '...'
			option += ')'
			option
	}
	computed: {
		...mapGetters 'search',
			-	'attribute_ids'
			-	'attributes_by_id'
		condition_by_id: -> @conditions.reduce((all, condition) =>
			all[condition.id] = condition
			all
		, {})
		condition_needs_value: ->
			@condition_by_id[@condition_id].needs_value
	}
</script>

<style lang="stylus" scoped>
.filters
	flex-wrap wrap
	font-size 80%
	> *
		margin 3px // TODO: only distance to each other, none to outside
	.filter
		padding 2px 4px
		// background: lightgrey
#form
	max-width 750px
	.attribute-select, .condition-value
		width 155px
	.condition
		select
			width 62px
			font-family monospace
			margin 0 auto
	.condition-value
		input
			width 130px
</style>
