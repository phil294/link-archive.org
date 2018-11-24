<template lang="slm">
# :_='
	div#kaa
		result-view/showers-selector
		div#bla
			result-view/result-table
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
#bla, #kaa // both needed for proper overflow in FF (idk) - todo
	overflow: auto
</style>
