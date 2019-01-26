<template lang="slm">
# :_='
	div#kaa.flex-fill.column		

		div#readonly-mode
			label
				| Readonly mode
				input type=checkbox model=readonly

		div#blub.column
			div#bla.margin
				result-view/result-table if=attributes.length @datumClicked=datumClicked($event) :readonly=readonly
				p.disabled.center else Loading...

		popup if=editing @close=editing=null
			result-view/edit-datum-dialog :product=editing.product :attributeId=editing.attributeId
		
		div if=!readonly
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
		Promise.all([
			store.dispatch('search/search'),
			store.dispatch('search/getAttributes')])
	data: ->
		showAddProductDialog: false
		editing: null
		readonly: false
	methods:
		datumClicked: editing ->
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
#kaa
	overflow: auto // FF
#blub
	overflow: auto
	width: 100%
#bla
	margin: 0 auto
	// overflow: auto
	min-height: 50% // FF: always effective by parent overflowing. Chrome: ignored, parent keeps size. :(
	max-height: 90%
</style>
