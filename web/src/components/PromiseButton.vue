<script lang="coffee">
import Vue from 'vue'
import ProgressButton from './ProgressButton'

###
 * Pass an `action` to this component that will resolve
 * to a promise. The button will wait for this promise
 * before it resets its loading state.
###
export default Vue.extend(
	name: 'PromiseButton'
	extends: ProgressButton
	props:
		action:
			type: Function
			required: true
	methods:
		clicked: ->
			# this.constructor.super.options.methods.clicked.call(this); # #2977
			ProgressButton.methods.clicked.call(@) # does not work with vue.extend in progressbutton
			try
				await this.$props.action()
			finally
				this.$data.loading = false
)
</script>
