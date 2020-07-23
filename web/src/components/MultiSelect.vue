<template lang="slm">
.column
	form.add-form.row.align-center.children-spacing-l @submit.prevent=add
		filter-select required="" v-model=new_option :options=unselected_options
		button.btn Add
	div.margin-l
		slot name=rendered :selected_options=selected_options :add=add :remove=remove :move_up=move_up :move_down=move_down
			.none-selected v-if=!selected_options.length
				small.disabled empty selection
			.selected-options.row.justify-center.children-spacing
				.selected-option.row.center.box v-for="selected_option, index in selected_options"
					button.name.remove title="Remove this option" @click=remove(index) $selected_option.name ╳
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
###
 * .........
###
export default
	name: 'MultiSelect'
	mixins: [ emitting_model ]
	props:
		options:
			type: Array
			default: => []
		value:
			type: Array
	data: ->
		new_option: ''
	created: ->
		if not @model
			@model = []
	methods:
		add: ->
			@model.push @new_option
			@model = @model
		remove: (index) ->
			@model.splice index, 1
			@model = @model
		move_up: (index) ->
			@model.splice(index - 1, 0, @model.splice(index, 1)[0])
			@model = @model
		move_down: (index) ->
			@model.splice(index + 1, 0, @model.splice(index, 1)[0])
			@model = @model
	computed:
		selected_options: ->
			@model.map (value) =>
				@$props.options.find (option) =>
					option.value == value
		unselected_options: ->
			@$props.options.filter (option) =>
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