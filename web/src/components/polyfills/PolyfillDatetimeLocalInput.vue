<template lang="slm">
div.row.children-spacing
	input type=date :min=min_date :max=max_date :required=required :readonly=readonly :disabled=disabled :value=date @input=on_input_date
	input type=time :min=min_time :max=max_time :required=required :readonly=readonly :disabled="disabled || !date_valid" :value=time @input=on_input_time
	input type=hidden :name=name :value=model
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
import dayjs from 'dayjs'

###
removal blocked by:
https://bugzilla.mozilla.org/show_bug.cgi?id=888320
###
export default
	mixins: [ emitting_model ]
	props:
		min:
			type: String
			default: ''
		max:
			type: String
			default: ''
		disabled:
			type: Boolean
			default: false
	methods:
		on_input_date: (event) ->
			@model = "#{event.target.value}T#{@time}"
		on_input_time: (event) ->
			@model = "#{@date}T#{event.target.value}"
	computed:
		date: ->
			@model.slice(0,10)
		time: ->
			@model.slice(11)
		date_valid: ->
			dayjs(@date).isValid()
		min_date: ->
			@min?.slice(0,10)
		min_time: ->
			@min?.slice(11)
		max_date: ->
			@max?.slice(0,10)
		max_time: ->
			@max?.slice(11)
</script>

<style lang="stylus" scoped>
</style>