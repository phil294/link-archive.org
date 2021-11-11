<template lang="slm">
resizable.column.movable
	.title-bar.fill-w.center v-moveable=moveable_data
		.grip ⠿⠿⠿⠿⠿
	slot
</template>

<script lang="coffee">
###* component wrapper (applies borders and such) that uses v-movable and Resizable.vue ###
export default
	props:
		snap_back:
			type: Boolean
			default: false
	emits: [ 'start_move', 'end_move' ]
	data: ->
		moveable_data:
			move_target: 'parent'
			snap_back: @snap_back
			onmovestart: =>
				@$emit 'start_move'
			onmoveend: ({offset}) =>
				@$emit 'end_move', offset
</script>

<style lang="stylus" scoped>
.movable
	--color-title-bar #dfdfdf73
	border 1px solid var(--color-title-bar)
	> .title-bar
		background var(--color-title-bar)
		position relative
		height 15px
		> .grip
			position absolute
			top 1px
			color #f5f5f5d9
		> .delete
			position absolute
			top -2px
			right -2px
</style>