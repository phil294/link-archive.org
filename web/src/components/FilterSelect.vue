<template lang="slm">
.row.align-center.children-spacing-l
	select :name=name :required=required model=model
		option each=filtered_option :value=filtered_option.value
			| $filtered_option.name
	input.filter type=text placeholder="Quick search..." model=filter
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
###
 * Behaves like a normal <select> but allows quick search with a text field
 * next to it
###
export default Vue.extend
	name: 'FilterSelect'
	mixins: [ emitting_model ]
	props:
		options:
			type: Array
			default: => []
	mounted: ->
		@check_model()
	data: ->
		filter: ''
	methods:
		check_model: ->
			if not @model or not @filtered_options.map((o)=>o.value).includes @model
				@model = @filtered_options[0]?.value
	computed:
		filtered_options: ->
			@$props.options.filter option =>
				option.name.includes @filter
	watch:
		filtered_options: ->
			@check_model()
</script>

<style lang="stylus" scoped>
@media only screen and (max-width: 767px)
	input.filter
		display none
</style>