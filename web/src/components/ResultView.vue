<template lang="slm">
# :_='
	div.flex-fill.column		

		div#readonly-mode
			label
				| Readonly mode
				input type=checkbox model=readonly

		div#result-table-container
			result-view/result-table#result-table if=attributes.length @datum_clicked=datum_clicked($event) :readonly=readonly
			p.disabled.center else Loading...

		popup if=editing @close=editing=null
			result-view/edit-datum-dialog :product=editing.product :attribute_id=editing.attribute_id
		
		div if=!readonly
			button if=!show_add_product_dialog @click=show_add_product_dialog=true
				| +
			button else @click=show_add_product_dialog=false
				| -
			result-view/add-product-dialog if=show_add_product_dialog
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapState } from 'vuex'
import search_store_module from '@/store/search-store'

export default Vue.extend(
	name: 'ResultView'
	async_data_hook: ({ store }) ->
		store.registerModule('search', search_store_module)
		Promise.all([
			store.dispatch('search/search'),
			store.dispatch('search/get_attributes')])
	data: ->
		show_add_product_dialog: false
		editing: null
		readonly: false
	methods:
		datum_clicked: editing ->
			@$data.editing = editing
	computed: {
		...mapState('search', [
			'attributes'
		])
	}
	destroyed: ->
		@$store.unregisterModule('search')
)
</script>

<style lang="stylus" scoped>
#result-table-container
	overflow: auto
#result-table
	margin: 0 auto
	min-height: 50%
	max-width: 100%
</style>
