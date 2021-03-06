### enables v-model from parent view
and adds the `model` property to this component for access.
setting the `model` emits the value.
I dont know whats going on here but it works great. ###
export default
	props:
		# todo use v-bind="$attrs" or use normal base element inheritance instead and remove all props. note that this will break all components that currently use name prop etc.
		modelValue:
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
	emits: [ 'update:modelValue' ]
	data: ->
		### internal_value takes its value either from a
		dynamically changed @modelValue or from user input directly. ###
		internal_value: @modelValue
	computed:
		model:
			get: -> @internal_value
			set: (new_value) ->
				@internal_value = new_value
				@$emit 'update:modelValue', new_value
	watch:
		modelValue:
			handler: (new_value) ->
				@internal_value = new_value
			deep: true