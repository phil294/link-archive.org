<template lang="slm">
.filter-select.row.align-center.children-spacing-l
	select.flex-fill :name=name :required=required v-model=model
		option v-for="filtered_option in filtered_options" :value=filtered_option.value
			| $filtered_option.name
	input.filter type=text placeholder="Quick search..." v-model=filter
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
###
 * Behaves like a normal <select> but allows quick search with a text field
 * next to it
###
export default
	name: 'FilterSelect'
	mixins: [ emitting_model ]
	props:
		options:
			type: Array # todo str array (because emitted values are also always string)
			default: => []
	mounted: ->
		@check_model()
	data: ->
		filter: ''
	methods:
		check_model: ->
			if not @model or not @filtered_options.map((o)=>o.value).includes @model
				new_value = @filtered_options[0]?.value
				if new_value
					@model = new_value
	computed:
		filtered_options: ->
			@options
				.map (option) =>
					if option.name
						option
					else
						value: option, name: option
				.filter (option) =>
					option.name.toLowerCase().includes @filter.toLowerCase()
	watch:
		filtered_options: ->
			@check_model()
</script>

<style lang="stylus" scoped>
@media only screen and (max-width: 767px)
	input.filter
		display none
select, input.filter
	width unset
.filter-select
	width 100%
</style>