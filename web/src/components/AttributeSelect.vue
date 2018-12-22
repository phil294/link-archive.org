<template lang="slm">
# :_='
div.column
	input#quicksearch model=filter placeholder="Quick search..."
	select :name=name :required=required # todo use datalist some day when its supported widely enough
		option each=filteredAttribute :value=filteredAttribute._id
			| $filteredAttribute.name
# '
</template>

<script lang="coffee">
import { mapActions, mapState, mapGetters } from 'vuex'
export default
	name: 'AttributeSelect'
	props:
		attributeIds:
			type: Array
			required: true
		name:
			type: String
			default: 'attributeId'
		required:
			type: Boolean
			default: false
	data: ->
		filter: ''
	computed: {
		...mapGetters('search', [
			'attributesById'
		])
		attributes: ->
			@attributeIds.map(id => @attributesById[id])
		filteredAttributes: ->
			@attributes.filter(a => a.name.includes(@$data.filter))
	}
</script>

<style lang="stylus" scoped>
#quicksearch
	padding: 0
	color: grey
	margin-bottom: 0
#quicksearch, select
	// width: 120px
</style>
