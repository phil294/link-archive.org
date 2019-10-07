### enables v-model from parent view
and adds the `model` property to this component for access.
setting the `model` emits the value. ###
export default
	props:
		value:
			# Override this / type if necessary
			default: ''
		# Some standard input props
		# fixme see https://github.com/vuejs/rfcs/blob/e183dca942c3fdadf061c4c6ff16db32a37dd50f/active-rfcs/0000-class-api.md#props -> ?
		name:
			type: String
		required:
			type: Boolean
			default: false
		readonly:
			type: Boolean
			default: false
	data: ->
		### internal_value takes its value either from a
		dynamically changed @$props.value or from user input directly. ###
		internal_value: @$props.value
	computed:
		model:
			get: -> @internal_value
			set: new_value ->
				@internal_value = new_value
				@$emit 'input', new_value
	watch:
		value: new_value ->
			@internal_value = new_value