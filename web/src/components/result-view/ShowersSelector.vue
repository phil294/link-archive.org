<template lang="slm">
	div#hallo.flex
		div.relevants.flex-fill
			h6 Shown columns
			ul
				li.shower.padding each=showerId drop=addShowerBelow(showerId) drag=showerId
					| {{ attributesById[showerId].name }}
				li.extra-attribute.disabled.padding each=extraAttributeId drag=extraAttributeId
					| {{ attributesById[extraAttributeId].name }}
		div.attributes.flex-fill
			h6 More columns
			ul
				li.attribute.padding each=availableAttributeId drag=availableAttributeId
					| {{ attributesById[availableAttributeId].name }}

</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultViewShowersSelector'
	methods: {
		...mapActions('search', [
			
		])
		addShowerBelow: whereId -> whatId ->
			# what ∈ [showers, extraAttributes, allAttributes]
			if whereId == whatId
				return
			# add, then remove
			console.log(whereId, whatId)
	}
	computed: {
		...mapState('search', [
			'showerIds'
			'extraAttributeIds'
		])
		...mapGetters('search', [
			'attributesById'
			'availableAttributeIds'
		])
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
		border-bottom: 2px solid green

</style>
