<template lang="slm">
.form-field.column :class.padding-s=!nolabel
	label v-if=!nolabel :title=field.title :for=id
		| $field.label
	select v-if="field.options||field.optgroups" :id=id v-model=model :name=field.name :required="field.required||!field.optional" :placeholder="field.placeholder||field.label"
		optgroup v-for="optgroup of field.optgroups" :label=optgroup.label
			/ kinda duplicate, not so pretty :-/
			option v-for="option of optgroup.options" :value=option.value
				| $option.name
		option v-for="option of field.options" :value=option.value
			| $option.name
	input :id=id v-else="" v-model=model :name=field.name :type=field.type :required="field.required||!field.optional" :placeholder="field.placeholder||field.label" :maxlength=field.maxlength :step=field.step :min=field.min :max=field.max onfocus=select()
</template>

<script lang="coffee">
id_i = 0

import emitting_model from '@/mixins/EmittingModel'
export default
	mixins: [ emitting_model ]
	props:
		default_values:
			default: => {}
			type: Object
		field:
			required: true
			type: Object
		nolabel:
			type: Boolean
			default: false
	mounted: ->
		if not @model
			@model = @field.default_value ? @default_values[@field.name]
	computed:
		id: ->
			"_form_#{@default_values.id or ''}_#{++id_i}_#{@field.name}"
</script>

<style lang="stylus" scoped>
</style>
