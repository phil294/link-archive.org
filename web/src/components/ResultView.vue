<template lang="slm">
	div.flex-fill.column		

		div#readonly-mode
			label
				| Readonly mode
				input type=checkbox model=readonly

		div#result-table-container
			result-view/result-table#result-table if=table_data_fetched @datum_clicked=datum_clicked($event) :readonly=readonly
			p.disabled.center else Loading...

		popup if=editing @close=editing=null # maybe use linus borgs portal instead?
			result-view/edit-datum-dialog :product=editing.product :attribute_id=editing.attribute_id

		div if=!readonly
			button if=!show_add_product_dialog @click=show_add_product_dialog=true # todo add toggle component
				| +
			button else @click=show_add_product_dialog=false
				| -
			result-view/add-product-dialog if=show_add_product_dialog
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapState } from 'vuex'
######import search_store_module from '@/store/search-store'

export default Vue.extend(
	name: 'ResultView'
	serverPrefetch: -> # note: docs say: You may find the same fetchItem() logic repeated multiple times (in serverPrefetch, mounted and watch callbacks) in each component - it is recommended to create your own abstraction (e.g. a mixin or a plugin) to simplify such code.
		######@register_search_store()
		######console.log(@$store.state.search.type)
		@fetch_table_data()
	data: ->
		show_add_product_dialog: false
		editing: null
		readonly: false
	methods:
		######register_search_store: ->
		######	@$store.registerModule 'search', search_store_module, { preserveState: true } # this doesnt work; state is missing inside search mutation afterwards. with preserveState:false, ssr data gets overridden. declaring module globally now, not sure whose fault this is
		fetch_table_data: ->
			Promise.all([ # todo yarn array syntax?
				@$store.dispatch('search/search'),
				@$store.dispatch('search/get_attributes')])
		datum_clicked: editing ->
			@$data.editing = editing
	computed: {
		...mapState 'search',
			-	'attributes'
		######table_data_fetched: -> @$store.state.search && @$store.state.search.attributes
		table_data_fetched: -> !!@attributes.length # todo chage to accept  no attributes (e.g. when new type)
	}
	mounted: ->
		######@register_search_store()
		if !@table_data_fetched
			@fetch_table_data()
	destroyed: ->
		######@$store.unregisterModule('search')
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
