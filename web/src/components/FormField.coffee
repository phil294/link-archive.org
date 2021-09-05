import emitting_model from '@/mixins/EmittingModel.coffee'

id_i = 0
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