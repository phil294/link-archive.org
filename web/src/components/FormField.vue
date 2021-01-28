<template lang="slm">
.form-field.column :class.padding-s=!nolabel
	label v-if=!nolabel :title=fielddata.title :for=id :disabled=fielddata.disabled
		| $fielddata.label
	select v-if="fielddata.options||fielddata.optgroups" :id=id v-model=model v-bind=fielddata :required="fielddata.required||!fielddata.optional" :placeholder="fielddata.placeholder||fielddata.label"
		optgroup v-for="optgroup of fielddata.optgroups" :label=optgroup.label
			/ kinda duplicate, not so pretty :-/
			option v-for="option of optgroup.options" :value=option.value
				| $option.name
		option v-for="option of fielddata.options" :value=option.value
			| $option.name
	slot v-else=""
		input :id=id v-model=model v-bind=fielddata @keypress="$emit('keypress',$event)" :required="fielddata.required||!fielddata.optional" :placeholder="fielddata.placeholder||fielddata.label" onfocus=select()
</template>

<script lang="coffee">
id_i = 0

import emitting_model from '@/mixins/EmittingModel'
export default
	mixins: [ emitting_model ]
	inheritAttrs: false
	props:
		default_values:
			default: => {}
			type: Object
		nolabel:
			type: Boolean
			default: false
		field:
			type: Object
			default: => {}
	mounted: ->
		if not @model
			@model = @fielddata.default_value ? @default_values[@fielddata.name]
	computed:
		fielddata: ->
			{ ...@field, ...@$attrs }
		id: ->
			"_form_#{@default_values.id or ''}_#{++id_i}_#{@fielddata.name or ''}"
</script>

<style lang="stylus" scoped>
</style>
