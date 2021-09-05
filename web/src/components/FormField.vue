<template lang="slm">
.form-field.column :class.padding-s=!nolabel
	label v-if=!nolabel :title=fielddata.title :for=id :disabled=fielddata.disabled
		| $fielddata.label
	select v-if="fielddata.options||fielddata.optgroups" :id=id v-model=model v-bind=fielddata
		optgroup v-for="optgroup of fielddata.optgroups" :label=optgroup.label
			/ kinda duplicate, not so pretty :-/
			option v-for="option of optgroup.options" :value=option.value
				| {{ option.name || option.value }}
		option v-for="option of fielddata.options" :value=option.value
			| {{ option.name || option.value }}
	slot v-else=""
		input :id=id v-model=model v-bind=fielddata @keypress="$emit('keypress',$event)" onfocus=select()
</template>

<script lang="coffee">
id_i = 0

import emitting_model from '@/mixins/EmittingModel'
export default
	mixins: [ emitting_model ]
	inheritAttrs: false
	props:
		### @Override ###
		value:
			default:
				null
		default_values:
			default: => {}
			type: Object
		nolabel:
			type: Boolean
			default: false
		field:
			type: Object
			default: => {}
	created: ->
		if not @model?
			@model = @fielddata.default_value ? @default_values[@fielddata.name]
	computed:
		fielddata: ->
			data = {
				# When passed as a $prop, name is somehow ignored, thats why it is
				# listed extra here
				name: @name
				...@field
				...@$attrs
			}
			data.required = data.required or not data.optional?
			data.placeholder = data.placeholder or data.label
			data
		id: ->
			"_form_#{++id_i}_#{@default_values.id or ''}_#{@fielddata.name or ''}"
</script>

<style lang="stylus" scoped>
</style>
