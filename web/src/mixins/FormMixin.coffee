import FormField from '@/components/FormField'

export default
	components: { FormField }
	props:
		action:
			required: true
			type: Function
		default_values:
			default: => {}
			type: Object