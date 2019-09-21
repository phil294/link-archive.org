<template lang="slm">
textarea rows=1 :maxlength=maxlength :required=required :value=value @input=on_input ref=ref :style.height=height
</template>

<script lang="coffee">
export default
	name: 'AutoexpandingTextarea'
	props:
		### enable v-model ###
		value:
			type: String
			default: ''
		maxlength:
			default: null
		required:
			type: Boolean
			default: false
	data: ->
		height: 0
	mounted: ->
		@autoadjust_height()
	methods:
		on_input: event ->
			@$emit 'input', event.target.value
			@autoadjust_height()
		autoadjust_height: ->
			@height = ''
			await @$nextTick()
			@height = @$refs.ref.scrollHeight + 'px'
</script>

<style lang="stylus" scoped>
</style>