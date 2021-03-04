<template lang="slm">
details @toggle=on_toggle ref=details
	summary :class.no-list-style=noliststyle
		/ This is invalid HTML :-(
		div.summary-content.align-center.fill
			slot name=summary
				small Details
	div.details.fade-in
		slot
</template>

<script lang="coffee">
import emitting_model from '@/mixins/EmittingModel'
###
 * <details>-wrapper
###
export default
	name: 'ReadMore'
	mixins: [ emitting_model ]
	props:
		noliststyle:
			default: false
			type: Boolean
	methods:
		on_toggle: (e) ->
			@model = !!e.target.open
	mounted: ->
		@$refs.details.open = !!@model
	watch:
		model:
			handler: (v) ->
				@$refs.details.open = !!v
</script>

<style lang="stylus" scoped>
details
	&[open]
		white-space pre-line
summary
	white-space nowrap
	&.no-list-style
		list-style none
		&::-webkit-details-marker
			display none
.summary-content
	display contents
</style>
