<template lang="slm">
# :_='
table
	thead
		tr
			th Filters
			td.filters each=showerId
				result-view/result-table/filters :filters=filtersByAttributeId[showerId] :attributeId=showerId
		tr
			th
			th each=showerId
				.attribute.center
					span.name $attributesById[showerId].name
					div.sort.column
						button.sort-up.disabled @click="toggleSortDirection(showerId, 1)" :class.highlighted=sortersByAttributeId[showerId].direction===1
							| ⮝
						button.sort-down.disabled @click="toggleSortDirection(showerId, -1)" :class.highlighted=sortersByAttributeId[showerId].direction===-1
							| ⮟
					div.index.highlighted if="sortersAmount > 1 && sortersByAttributeId[showerId].index >= 0"
						| $sortersByAttributeId[showerId].index+1
	tbody
		tr.product each=product
			td.name
				| $product.name
			td.datum each=showerId @click=datumClicked(product,showerId)
				div if=product.data[showerId]
					span.value :class.disabled="!product.data[showerId].verified"
						| $product.data[showerId].value
					button.edit @click=datumClicked(product,showerId)
						| 🖉
				div else
					span
						| &#63; # ¿
					button.edit.add @click=datumClicked(product,showerId)
						| + 🖉
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
table
	--separator: 1px solid #e3e3e3
	border-collapse: collapse
tr
	height: 1em
	background: #fff
tbody
	tr:nth-child(odd)
		background: #f2f2f2
td, th
	padding: 6px
	border-bottom: var(--separator)
	min-width: 100px
td:first-child, th // would be better on thead but this does not seem possible
	position: sticky
	background: inherit
td:first-child
	z-index: 1
	left: 0
	border-right: var(--separator)
th
	z-index: 2
	top: 0
.attribute
	.sort
		padding-left: 0.7vw
		position: relative
		.sort-up, .sort-down
			&:hover
				color: var(--color-main)
		.sort-up
			position: relative
			top: -0.2em
		.sort-down
			position: absolute
			bottom: -0.6em
	.index
		font-size: 80%
td.datum
	text-align: center
	.value
		font-size: 80%
	button.edit
		font-size: 80%
	button.add
		color: green

</style>
