<template lang="slm">
# :_='
div.column
	input#quicksearch type=search model=filter placeholder="Quick search..."
	select :name=name :required=required # todo use datalist some day when its supported widely enough
		option each=filtered_attribute :value=filtered_attribute._id
			| $filtered_attribute.name
# '
</template>

<script lang="coffee">
import { mapActions, mapState, mapGetters } from 'vuex'
export default
	name: 'AttributeSelect'
	props:
		attribute_ids:
			type: Array
			required: true
		name:
			type: String
			default: 'attribute_id'
		required:
			type: Boolean
			default: false
	data: ->
		filter: ''
	computed: {
		...mapGetters('search', [
			'attributes_by_id'
		])
		attributes: ->
			@attribute_ids.map(id => @attributes_by_id[id])
		filtered_attributes: ->
			@attributes.filter(a => a.name.includes(@$data.filter))
	}
</script>

<style lang="stylus" scoped>
#quicksearch
	padding: 0
	color: grey
	margin-bottom: 0
</style>
