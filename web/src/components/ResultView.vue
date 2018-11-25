<template lang="slm">
# :_='
	div#kaa.column
		div
			button if=!showShowersSelector @click=showShowersSelector=true
				| +
			button else @click=showShowersSelector=false
				| -
			result-view/showers-selector if=showShowersSelector
		
		div#bla
			result-view/result-table
		
		div
			button if=!showAddProductDialog @click=showAddProductDialog=true
				| +
			button else @click=showAddProductDialog=false
				| -
			result-view/add-product-dialog if=showAddProductDialog
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapState } from 'vuex'
import searchStoreModule from '@/store/search-store'

export default Vue.extend(
	name: 'ResultView'
	asyncDataHook: ({ store }) ->
		store.registerModule('search', searchStoreModule)
		store.dispatch('search/search')
	data: ->
		showShowersSelector: false
		showAddProductDialog: false
	computed: {
		...mapState('search', [
			'attributes'
			'sorters'
			'filters'
			'showers'
		])
	}
	destroyed: ->
		@$store.unregisterModule('search')
)
</script>

<style lang="stylus" scoped>
#kaa
	overflow: auto // FF
#bla
	overflow: auto
	min-height: 80% // FF: always effective by parent overflowing. Chrome: ignored, parent keeps size. :(
</style>
