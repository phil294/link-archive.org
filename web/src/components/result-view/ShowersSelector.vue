<template lang="slm">
	div#hallo.flex
		div.relevants.flex-fill
			h4 Shown columns
			ul drop
				li.shower.padding each=shower drag
					| {{ attributesById[shower].name }}
				li.extra-attribute.disabled.padding each=extraAttribute
					| {{ attributesById[extraAttribute].name }}
		div.attributes.flex-fill
			h4 More columns
			ul
				li.attribute.padding each=attribute -key=attribute.id drag
					| {{ attribute.name }}

</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultViewShowersSelector'
	methods: {
		...mapActions('search', [
			
		])
	}
	computed: {
		...mapState('search', [
			'attributes'
			'showers'
			'extraAttributes'
		])
		...mapGetters('search', [
			'attributesById'
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

</style>
