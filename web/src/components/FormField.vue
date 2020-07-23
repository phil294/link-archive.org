<template lang="slm">
div.column :class.padding-s=!nolabel
	label v-if=!nolabel :title=field.title :for=id
		| $field.label
	input :id=id v-if=!field.options v-model=model :name=field.name :type=field.type :required="field.required||!field.optional" :placeholder="field.placeholder||field.label" :maxlength=field.maxlength :step=field.step :min=field.min :max=field.max
	select v-else="" :id=id v-model=model :name=field.name :required="field.required||!field.optional" :placeholder="field.placeholder||field.label"
		option v-for="option of field.options" :value=option.value
			| $option.name
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
		@model = @field.default_value or @default_values[@field.name]
	computed:
		id: ->
			"_form_#{@default_values.id or ''}_#{++id_i}_#{@field.name}"
</script>

<style lang="stylus" scoped>
</style>
