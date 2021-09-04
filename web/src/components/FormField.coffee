id_i = 0

import emitting_model from '@/mixins/EmittingModel'
export default
	mixins: [ emitting_model ]
	inheritAttrs: false
	props:
		### @Override ###
		modelValue:
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