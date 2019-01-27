<template lang="slm">
# :_='
table
	thead
		tr
			td
			td.filters each=showerId
				result-view/result-table/filters :filters=filtersByAttributeId[showerId] :attributeId=showerId :readonly=readonly
		tr.attributes :class.drop-target=draggingColumn
			th.dropzone.remove.column if=draggingColumn drop=removeShower
				div 🗙
				div.description Hide column
			th else Name
			th.dropzone.move v-for="showerId, index in showerIds" :key="showerId+'_'+index" drop=moveShowerTo(index)
				.attribute.column
					div.actions.center if="!readonly && !canDrag"
						button.moveto @click=moveShowerTo(index-1)(showerId) ←
						button.remove @click=removeShower(showerId) 🗙
						button.moveto @click=moveShowerTo(index+2)(showerId) →
					div.name.center
						div drag="!readonly && canDrag && showerId" @dragstart=draggingColumn=true @dragend=draggingColumn=false
							span.grip if="!readonly && canDrag" ⠿
							| $attributesById[showerId].name
						div.sort.column
							button.sort-up.disabled :disabled=readonly @click="toggleSortDirection(showerId, 1)" :class.highlighted=sortersByAttributeId[showerId].direction===1
								| ▲ # ˄
							button.sort-down.disabled :disabled=readonly @click="toggleSortDirection(showerId, -1)" :class.highlighted=sortersByAttributeId[showerId].direction===-1
								| ▼ # ˅
						div.small.highlighted if="sortersAmount > 1 && sortersByAttributeId[showerId].index >= 0"
							| $sortersByAttributeId[showerId].index+1

	tbody
		tr.product each=product
			td.name
				| $product.name
			td.datum each=showerId @click=datumClicked(product,showerId)
				div if=product.data[showerId]
					div if=product.data[showerId].verified
						span
							| $product.data[showerId].value
						button.edit.verified @click=datumClicked(product,showerId) if=!readonly
							| ✓ # ✔
					div else
						span.disabled
							| $product.data[showerId].value
						button.edit.disabled @click=datumClicked(product,showerId) if=!readonly
							| ✎
				div else
					span.small
						| # &#63; # ¿
					button.edit.disabled @click=datumClicked(product,showerId) if=!readonly
						| + # 🖉
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultView'
	props:
		readonly:
			default: false
	data: =>
		canDrag: true
		draggingColumn: false
	methods: {
		...mapActions('search', [
			
		])
		toggleSortDirection: (attributeId, direction) ->
			@$store.dispatch('search/toggleSortDirection', { attributeId, direction })
		datumClicked: (product, attributeId) ->
			if @readonly then return
			@$emit('datumClicked', { product, attributeId })
		moveShowerTo: index -> showerId =>
			@$store.dispatch('search/moveShowerTo', { showerId, index })
		removeShower: showerId ->
			@$store.dispatch('search/removeShower', showerId)
	}
	computed: {
		...mapState('search', [
			'products'
			'showerIds'
		])
		...mapGetters('search', [
			'filtersByAttributeId'
			'sortersByAttributeId'
			'sortersAmount'
			'attributesById'
		])
	}
	mounted: ->
		@$data.canDrag = !(`'ontouchstart' in window` || navigator.maxTouchPoints)
)
</script>

<style lang="stylus" scoped>
// Bug: sticky + border-collapse + border: border not shown. SO#41882616. todo: remove once fixed everywhere (lol).
border-base-fix()
	&::after
		content: ''
		position: absolute
		bottom: 0
		z-index: -1
border-right-fix()
	border-base-fix()
	&::after
		border-right: arguments
		height: 100%
		right: 0
border-left-fix()
	border-base-fix()
	&::after
		border-left: arguments
		height: 100%
		left: 0
border-bottom-fix()
	border-base-fix()
	&::after
		border-bottom: arguments
		width: 100%
		right: 0
border-fix()
	border-right-fix(arguments)
	border-left-fix(arguments)
	border-bottom-fix(arguments)
table
	--separator: 1px solid #e3e3e3
	border-collapse: collapse
tr
	height: 1em
	background: #fff
tbody
	tr:nth-child(odd)
		background: #f5f5f5
td, th
	max-width: 150px
td, th, .attribute
	position: relative
tbody td
	padding: 8px 6px
	min-width: 100px
	word-wrap: break-word
td:first-child, th
	position: sticky
	background: inherit
th
	z-index: 2
	top: 0
	padding: 6px
	border-bottom-fix: var(--separator)
tbody td:first-child
	z-index: 1
	left: 0
tbody td
	border-bottom: var(--separator)
tbody td:first-child, th:not(:last-child)
	border-right-fix: var(--separator)
tbody td:not(:first-child):not(:last-child)
	border-right: var(--separator)
.attributes.drop-target > th.dropzone
	color: #246
	&.drop
		&.move
			border-left-fix: 2px solid var(--color-highlighted)
		&.remove
			color: var(--color-highlighted)
	&.remove .description
		text-transform: uppercase
		font-size: 80%
.attribute
	padding: 1px 6px
	.name
		.grip
			font-weight: normal
			color: #bbb
			font-size: 70%
			margin-right: 4px
	.sort
		padding-left: 0.2em
		position: relative
		.sort-up, .sort-down
			padding: 0
			font-size: 70%
			&:hover
				color: var(--color-main)
		.sort-up
			position: relative
			top: -4px
		.sort-down
			position: absolute
			bottom: -4px
	.actions
		height: 8px
		.remove
			font-size: 50%
			margin: 0 13px
td.datum
	text-align: center
	button.edit
		position: absolute
		right: 0
		bottom: 0
		&.verified
			color: #9d7

</style>
