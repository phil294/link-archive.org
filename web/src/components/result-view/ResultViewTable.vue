<template lang="slm">
	table
		thead
			tr
				th
				th v-for="attribute in attributes" -key=attribute.id
					.attribute.center
						span.name {{ attribute.name }}
						div.sort.column.fill-h.disabled
							# clickable html element todo
							span.sort-up %click="toggleSortDirection(attribute.id, 1)" -class="{highlighted: sortersByAttribute[attribute.id].direction===1}"
								| ⮝
							span.sort-down %click="toggleSortDirection(attribute.id, -1)" -class="{highlighted: sortersByAttribute[attribute.id].direction===-1}"
								| ⮟
						div.index.highlighted if="sortersByAttribute[attribute.id].index >= 0"
							| {{ sortersByAttribute[attribute.id].index + 1 }}
		tbody
			tr v-for="entry in result" # key? todo
				td
					| {{ entry.name }}
				td.value v-for="attribute in attributes" -key=attribute.name
					| {{ entry[attribute.name] }}

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
			'result'
		])
		...mapGetters('search', [
			'sortersByAttribute'
		])
	}
)
</script>

<style lang="stylus" scoped>
table
	text-align: justify
	border-collapse: collapse
tr
	height: 1em
td, th
	padding: 1.5vw
	border-bottom: 1px solid #f1f1f1
.attribute
	height: 1.3em
	.sort
		padding-left: 0.7vw
		font-size: 80%
		cursor: pointer
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
		padding-left: 0.3vw
		font-size: 80%
.value
	font-size: 80%

</style>
