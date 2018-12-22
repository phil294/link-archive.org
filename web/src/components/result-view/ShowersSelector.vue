<template lang="slm">
# :_='
div#hallo.flex
	div.relevants.flex-fill
		h6 Shown columns
		ul
			div.showers
				li.shower.padding v-for="showerId, showerIndex in showerIds" :key="showerId+'_'+showerIndex" drop=addShowerAt(showerIndex) drag=showerId
					# todo ^ key needed?
					| $attributesById[showerId].name
			div.extra-attributes drop=addShowerAt(-1)
				li.extra-attribute.disabled.padding each=extraId drag=extraId :key=extraId
					| $attributesById[extraId].name
	div.attributes.flex-fill
		h6 More columns
		input model=filter
		ul
			li.attribute.padding v-for="attrId of filteredAvailableAttributeIds" drag=attrId :key=attrId # todo: use attribute-select in some way¿
				| $attributesById[attrId].name
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultViewShowersSelector'
	data: ->
		filter: ''
	methods: {
		...mapActions('search', [
			
		])
		addShowerAt: index -> showerId =>
			if index == -1
				index = @showerIds.length
			@$store.dispatch('search/addShowerAt', { showerId, index })
	}
	computed: {
		...mapState('search', [
			'showerIds'
			'extraIds'
		])
		...mapGetters('search', [
			'attributesById'
			'hiddenAttributeIds'
		])
		filteredAvailableAttributeIds: ->
			@hiddenAttributeIds.filter(a => a.includes(@$data.filter))
	}
)
</script>

<style lang="stylus" scoped>
#hallo
	justify-content: space-evenly
	padding: 1vw 8vw
ul
	padding: 0
	margin: 0	
.relevants
	margin-right: 8vw
.shower
	font-weight: bold
// .extra-attribute
li
	list-style-type: none
	border: 1px solid #eee
	// border-collapse: collapse
&.drop
	border-top: 2px solid green

</style>
