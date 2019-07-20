<template lang="slm">
table
	thead
		tr
			td
			td.filters each=shower_id
				result-view/result-table/filters :filters=filters_by_attribute_id[shower_id] :attribute_id=shower_id :readonly=readonly
		tr.attributes :class.drop-target=dragging_column
			th.dropzone.remove.column if=dragging_column drop=remove_shower
				div 🗙
				div.description.danger Hide column
			th else Name
			th.dropzone.move v-for="shower_id, index in shower_ids" :key="shower_id+'_'+index" drop=move_shower_to(index)
				.attribute.column
					div.actions.center if="!readonly && !can_drag"
						button.moveto @click=move_shower_to(index-1)(shower_id) ←
						button.remove @click=remove_shower(shower_id) 🗙
						button.moveto @click=move_shower_to(index+2)(shower_id) →
					div.name.center
						div drag="!readonly && can_drag && shower_id" @dragstart=dragging_column=true @dragend=dragging_column=false
							span.grip if="!readonly && can_drag" ⠿
							| $attributes_by_id[shower_id].name
						div.sort.column
							button.sort-up.disabled :disabled=readonly @click="toggle_sort_direction(shower_id, 1)" :class.highlighted=sorters_by_attribute_id[shower_id].direction===1
								| ▲ # ˄ todo svg
							button.sort-down.disabled :disabled=readonly @click="toggle_sort_direction(shower_id, -1)" :class.highlighted=sorters_by_attribute_id[shower_id].direction===-1
								| ▼ # ˅
						div.small.highlighted if="sorters_amount > 1 && sorters_by_attribute_id[shower_id].index >= 0"
							| $sorters_by_attribute_id[shower_id].index+1

	tbody
		tr.product each=product
			td.name
				| $product.name
			td.datum each=shower_id @click=datum_clicked(product,shower_id)
				div if=product.data[shower_id]
					div if=product.data[shower_id].verified
						span.verified
							| $product.data[shower_id].value
						button.edit.disabled if=!readonly
							| ✎ # ✓ # ✔
					div else
						span.disabled
							| $product.data[shower_id].value
						button.edit if=!readonly
							| ✎
				div else
					span.small
						| # &#63; # ?
					button.edit.create if=!readonly
						| + # 🖉
</template>

<script lang="coffee">
export default Vue.extend
	# name: 'ResultTable' todo?
	props:
		readonly:
			default: false
	data: =>
		can_drag: true
		dragging_column: false
	methods:
		toggle_sort_direction: (attribute_id, direction) ->
			@$store.dispatch 'search/toggle_sort_direction', { attribute_id, direction }
		datum_clicked: (product, attribute_id) ->
			if @readonly then return
			@$emit 'datum_clicked', { product, attribute_id }
		move_shower_to: index -> shower_id =>
			@$store.dispatch 'search/move_shower_to', { shower_id, index }
		remove_shower: shower_id ->
			@$store.dispatch 'search/remove_shower', shower_id
	computed: {
		...mapState 'search',
			-	'products'
			-	'shower_ids'
		...mapGetters 'search',
			-	'filters_by_attribute_id'
			-	'sorters_by_attribute_id'
			-	'sorters_amount'
			-	'attributes_by_id'
	}
	mounted: ->
		@can_drag = !(`'ontouchstart' in window` || navigator.maxTouchPoints) # todo "in" in cs? / todo css solution? media query blah
</script>

<style lang="stylus" scoped>
// Bug: sticky + border-collapse + border: border not shown. SO#41882616. todo: remove once fixed everywhere (lol).
border-base-fix()
	&::after
		content ''
		position absolute
		bottom 0
		z-index -1
border-right-fix()
	border-base-fix()
	// border-right arguments todo ?
	&::after
		border-right arguments
		height 100%
		right 0
border-left-fix()
	border-base-fix()
	&::after
		border-left arguments
		height 100%
		left 0
border-bottom-fix()
	border-base-fix()
	&::after
		border-bottom arguments
		width 100%
		right 0
border-fix()
	border-right-fix(arguments)
	border-left-fix(arguments)
	border-bottom-fix(arguments)
table
	--separator 1px solid #e3e3e3
	border-collapse collapse
tr
	height 1em
	background #fff
tbody
	tr:nth-child(odd)
		background #f5f5f5
td, th
	max-width 150px
td, th, .attribute
	position relative
tbody td
	padding 8px 6px
	min-width 100px
	word-wrap break-word
td:first-child, th
	position sticky
	background inherit
th
	z-index 2
	top 0
	padding 6px
	border-bottom-fix var(--separator)
tbody td:first-child
	z-index 1
	left 0
tbody td
	border-bottom var(--separator)
tbody td:first-child, th:not(:last-child)
	border-right-fix var(--separator)
tbody td:not(:first-child):not(:last-child)
	border-right var(--separator)
.attributes.drop-target > th.dropzone
	color #246
	&.drop
		&.move
			border-left-fix 2px solid var(--color-highlighted)
		&.remove
			color var(--color-highlighted)
	&.remove .description
		text-transform uppercase
		font-size 80%
.attribute
	padding 1px 6px
	.name
		.grip
			font-weight normal
			color #bbb
			font-size 70%
			margin-right 4px
	.sort
		padding-left 3px
		position relative
		.sort-up, .sort-down
			padding 0
			font-size 70%
			&:hover
				color var(--color-main)
		.sort-up
			position relative
			top -5px
		.sort-down
			position absolute
			bottom -4px
	.actions
		height 8px
		.remove
			font-size 50%
			margin 0 13px
td.datum
	text-align center
	button.edit
		position absolute
		right 0
		bottom 0
		&.create
			color #A0AB82
	.verified
		color #0B6721

</style>
