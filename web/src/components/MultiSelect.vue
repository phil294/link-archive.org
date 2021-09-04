<template lang="slm">
.multi-select.flex-base
	slot name=add :add=add :options=unselected_options
		promise-form.add-form.row.align-center.children-spacing-l :action=add_formdata
			slot name=add_select :options=unselected_options
				select v-if=nofilter required="" name=value
					option v-for="option of unselected_options" :value="option.value||option"
						| {{ option.name || option }}
				filter-select v-else="" required="" name=value :options=unselected_options
			slot name=add_fields
			template #button_label="" Add
	.list
		slot name=rendered :selected_options=selected_options :add=add :remove=remove :move_up=move_up :move_down=move_down
			.none-selected v-if=!selected_options.length
				small.disabled empty selection
			.selected-options.row.justify-center.children-spacing
				.selected-option.row.center.box v-for="selected_option, index in selected_options"
					button.name.remove title="Remove this option" @click=remove(index)
						| {{ selected_option.name || selected_option }} 
						span.x ╳
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
		modelValue:
			type: Array
		nofilter:
			type: Boolean
			default: false
		add_action:
			type: Function
			default: null
	data: ->
		new_option: ''
		values_type: 'string'
	created: ->
		if not @model
			@model = []
	methods:
		add: (value) ->
			# value is now inherently type string. maybe change that:
			if @values_type == 'number'
				value = value * 1
			@model.push value
			@model = @model
		add_formdata: (promiseform_data) ->
			if @add_action
				@add_action promiseform_data
			else
				@add promiseform_data.value
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
				@options.find((option) =>
					option.value == value or option == value) or
				{ value }
		unselected_options: ->
			@options.filter (option) =>
				not @selected_options.includes option
	watch:
		options:
			immediate: true
			handler: ->
				if @options.length
					@values_type = typeof (@options[0].value or @options[0])
</script>

<style lang="stylus" scoped>
.multi-select
	flex-direction column
.add-form
	width 100%
.selected-options
	max-width 700px
	flex-wrap wrap
	.selected-option
		padding 4px 7px
		margin 4px
		.remove > .x
			font-family initial
.list
	overflow auto
</style>