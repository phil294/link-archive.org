<template lang="slm">
textarea :name=name rows=1 :maxlength=maxlength :required=required :placeholder=placeholder v-model=model @focus=on_focus @blur=on_blur ref=ref :style.height=height
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
export default
	name: 'AutoexpandingTextarea'
	mixins: [ emitting_model ]
	props:
		maxlength:
			default: null
		placeholder:
			type: String
			default: ''
	mounted: ->
		await @update_content_height()
		await @on_blur()
	data: ->
		height: 'inherit'
		content_height: 0
	methods:
		on_focus: ->
			@height = @content_height
		on_blur: ->
			@content_height = @height
			await @$nextTick()
			@height = 'inherit'
		update_content_height: ->
			@height = ''
			await @$nextTick()
			@height = @$refs.ref.scrollHeight + 'px'
	watch:
		model: ->
			@update_content_height()
</script>

<style lang="stylus" scoped>
</style>