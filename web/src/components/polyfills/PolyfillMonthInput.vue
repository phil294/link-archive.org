<template lang="slm">
div.row.children-spacing
	input type=number :min=min_year :max=max_year :required=required :readonly=year_readonly :disabled=disabled v-model=year title=Year placeholder=Year
	select v-model=month :required=required :readonly=readonly :disabled=disabled
		option v-for="option of month_options" :value=option.value :disabled=option.disabled
			| $option.name
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
		disabled:
			type: Boolean
			default: false
		min:
			type: String
			default: ''
		max:
			type: String
			default: ''
	computed:
		month_options: ->
			[0..11].map (month_i) =>
				name: dayjs().month(month_i).format 'MMMM'
				value: "#{month_i+1}".padStart(2,0)
				# TODO: disabled property, to enforce min/max date (depending on year... more complicated, thus skipped for now)
		min_year: ->
			@min.slice 0, 4
		max_year: ->
			@max.slice 0, 4
		year_readonly: ->
			@readonly or @min_year == @max_year
		year:
			get: ->
				if @min_year == @max_year
					return @min_year
				@model.slice 0, 3
			set: (year) ->
				@model = "#{year}-#{@month}"
		month:
			get: ->
				@model.slice 5, 7
			set: (month) ->
				@model = "#{@year}-#{month}"
</script>

<style lang="stylus" scoped>
</style>