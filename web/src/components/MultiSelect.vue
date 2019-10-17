<template lang="slm">
.column
	promise-form.add-form.row.align-center.children-spacing-l :action=add
		filter-select required name=selected_option :options=unselected_options
		template #button_label Add
	div.margin-l
		slot name=rendered :add=add :remove=remove :selected_options=selected_options
			.none-selected if=!selected_options.length
				small.disabled empty selection
			.selected-options.row.justify-center.children-spacing
				.selected-option.row.center.box each=selected_option
					button.name.remove title="Remove this option" @click=remove(selected_option.value) $selected_option.name ×
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
###
 * .........
###
export default Vue.extend
	name: 'MultiSelect'
	mixins: [ emitting_model ]
	props:
		options:
			type: Array
			default: => []
		value:
			type: Array
	methods:
		add: ({ values }) ->
			@model.push values.selected_option
			@model = @model
		remove: value ->
			@model.splice @model.indexOf(value), 1
			@model = @model
	computed:
		selected_options: ->
			@$props.options.filter option =>
				@model.includes option.value
		unselected_options: ->
			@$props.options.filter option =>
				not @selected_options.includes option
	watch:
		options: ->
			@model = []
</script>

<style lang="stylus" scoped>
.add-form
	width 100%
.selected-options
	max-width 700px
	flex-wrap wrap
	.selected-option
		padding 4px 7px
		margin 4px
</style>