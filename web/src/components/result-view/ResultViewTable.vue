<template lang="slm">
	table
		thead
			tr
				th
				th v-for="attribute in relevantAttributes" -key=attribute.id
					.attribute.center
						span.name {{ attribute.name }}
						div.sort.column
							# clickable html element todo
							button.sort-up.disabled %click="toggleSortDirection(attribute.id, 1)" -class="{highlighted: sortersByAttribute[attribute.id].direction===1}"
								| ⮝
							button.sort-down.disabled %click="toggleSortDirection(attribute.id, -1)" -class="{highlighted: sortersByAttribute[attribute.id].direction===-1}"
								| ⮟
						div.index.highlighted if="sortersAmount > 1 && sortersByAttribute[attribute.id].index >= 0"
							| {{ sortersByAttribute[attribute.id].index + 1 }}
		tbody
			tr.product each=product -key=product.id
				td.name
					| {{ product.name }}
				td.value v-for="attribute in relevantAttributes" -key=attribute.name
					| {{ product[attribute.id] }}
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultView'
	# components: { TokenInput, PromiseButton, PromiseForm, ReadMore }
	methods: {
		...mapActions('search', [
			
		])
		toggleSortDirection: (attribute, direction) ->
			@$store.dispatch('search/toggleSortDirection', { attribute, direction })
	}
	computed: {
		...mapState('search', [
			'attributes'
			'products'
		])
		...mapGetters('search', [
			'sortersByAttribute'
			'sortersAmount'
			'relevantAttributes'
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
.value
	font-size: 80%

</style>
