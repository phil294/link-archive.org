<template lang="slm">
# :_='
table
	thead
		tr
			th
			th v-for="attribute in relevantAttributes" :key=attribute.id
				.attribute.center
					span.name $attribute.name
					div.sort.column
						button.sort-up.disabled @click="toggleSortDirection(attribute.id, 1)" :class.highlighted=sortersByAttributeId[attribute.id].direction===1
							| ⮝
						button.sort-down.disabled @click="toggleSortDirection(attribute.id, -1)" :class.highlighted=sortersByAttributeId[attribute.id].direction===-1
							| ⮟
					div.index.highlighted if="sortersAmount > 1 && sortersByAttributeId[attribute.id].index >= 0"
						| $sortersByAttributeId[attribute.id].index+1
	tbody
		tr.product each=product :key=product.id
			td.name
				| $product.name
			td.datum v-for="att of relevantAttributeIds" @click=datumClicked(product,att)
				div if=product.data[att]
					span.value :class.disabled="!product.data[att].verified"
						| $product.data[att].value
					button.edit @click=datumClicked(product,att)
						| 🖉
				div else
					span
						| &#63; # questionmark
					button.edit.add @click=datumClicked(product,att)
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
	###	productData: product ->
			@relevantAttributeIds.map(attributeId =>
				product.data[attributeId]) ###
		datumClicked: (product, attributeId) ->
			@$emit('datumClicked', { product, attributeId })

	}
	computed: {
		...mapState('search', [
			'attributes'
			'products'
		])
		...mapGetters('search', [
			'sortersByAttributeId'
			'sortersAmount'
			'relevantAttributeIds'
			'attributesById'
		])
		relevantAttributes: ->
			@relevantAttributeIds.map(attributeId =>
				@attributesById[attributeId])
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
			top: -0.3em
		.sort-down
			position: absolute
			bottom: -0.7em
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
