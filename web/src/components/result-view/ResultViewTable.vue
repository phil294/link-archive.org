<template lang="slm">
	table
		thead
			tr
				th
				th v-for="attribute in attributes" -key=attribute.name
					| {{ attribute.name }}
		tbody
			tr v-for="entry in result" # key? todo
				td
					| {{ entry.name }}
				td.value v-for="attribute in attributes" -key=attribute.name
					| {{ entry[attribute.name] }}

</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend(
	name: 'ResultView'
	# components: { TokenInput, PromiseButton, PromiseForm, ReadMore }
	computed: mapState('search', [
		'attributes'
		'result'
	])
)
</script>

<style lang="stylus" scoped>
table
	text-align: justify
	border-collapse: collapse
tr
	height: 1em
td, th
	padding: 1.7vw
	border-bottom: 1px solid #f1f1f1
td.value
	font-size: 80%

</style>
