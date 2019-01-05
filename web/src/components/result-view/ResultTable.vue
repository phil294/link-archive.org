<template lang="slm">
# :_='
table
	thead
		tr
			td
			td.filters each=showerId
				result-view/result-table/filters :filters=filtersByAttributeId[showerId] :attributeId=showerId
		tr
			th
			th each=showerId
				.attribute.center
					span.name $attributesById[showerId].name
					div.sort.column
						button.sort-up.disabled @click="toggleSortDirection(showerId, 1)" :class.highlighted=sortersByAttributeId[showerId].direction===1
							| ▲
						button.sort-down.disabled @click="toggleSortDirection(showerId, -1)" :class.highlighted=sortersByAttributeId[showerId].direction===-1
							| ▼
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
						button.edit.verified @click=datumClicked(product,showerId)
							| ✓ # ✔
					div else
						span.disabled
							| $product.data[showerId].value
						button.edit.disabled @click=datumClicked(product,showerId)
							| ✎
				div else
					span.small
						| # &#63; # ¿
					button.edit.disabled @click=datumClicked(product,showerId)
						| + # 🖉
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultView'
	methods: {
		...mapActions('search', [
			
		])
		toggleSortDirection: (attributeId, direction) ->
			@$store.dispatch('search/toggleSortDirection', { attributeId, direction })
		datumClicked: (product, attributeId) ->
			@$emit('datumClicked', { product, attributeId })

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
)
</script>

<style lang="stylus" scoped>
// Bug: sticky + border-collapse + border: border not shown. SO#41882616. todo: remove once fixed everywhere (lol).
border-fix()
	&::after
		content: ''
		position: absolute
		right: 0
		bottom: 0
border-right-fix()
	border-fix()
	&::after
		border-right: arguments
		height: 100%
border-bottom-fix()
	border-fix()
	&::after
		border-bottom: arguments
		width: 100%
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
	position: relative
tbody td, th
	padding: 8px 6px
	border-bottom-fix: var(--separator)
	min-width: 100px
	word-wrap: break-word
td:first-child, th // would be better on thead but this does not seem possible
	position: sticky
	background: inherit
tbody td:first-child
	z-index: 1
	left: 0
tbody td:first-child
	border-right-fix: var(--separator)
tbody td:not(:first-child):not(:last-child), th:not(:first-child):not(:last-child)
	border-right: var(--separator)
th
	z-index: 2
	top: 0
.attribute
	.sort
		padding-left: 0.2em
		position: relative
		.sort-up, .sort-down
			padding: 0
			&:hover
				color: var(--color-main)
		.sort-up
			position: relative
			top: -0.5em
		.sort-down
			position: absolute
			bottom: -0.3em
td.datum
	text-align: center
	button.edit
		position: absolute
		right: 0
		bottom: 0
		&.verified
			color: #9d7

</style>
