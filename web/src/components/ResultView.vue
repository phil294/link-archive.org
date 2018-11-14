<template lang="slm">
	div#kaa.column
		div
			# result-view-filters
			p sorters: {{ sorters }}
			p filters: {{ filters }}
			p showers: {{ showers }}
			p extraAttributes: {{ extraAttributes }}
		div#bla
			result-view/showers-selector
			result-view/result-table.flex-fill
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapState } from 'vuex'
import searchStoreModule from '@/store/search-store'
# import PromiseButton from '@/components/PromiseButton'
# import PromiseForm from '@/components/PromiseForm'
# import ReadMore from '@/components/ReadMore'

export default Vue.extend(
	name: 'ResultView'
	asyncDataHook: ({ store }) ->
		store.registerModule('search', searchStoreModule)
		store.dispatch('search/search')
	computed: {
		...mapState('search', [
			'attributes'
			'sorters'
			'filters'
			'showers'
			'extraAttributes'
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
