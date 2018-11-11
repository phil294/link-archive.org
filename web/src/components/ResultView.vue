<template lang="slm">
	div#scrollcontainer.fill
		# result-view-filters
		result-view-table
		p sorters: {{ sorters }}
		p filters: {{ filters }}
		p showers: {{ showers }}
		p extraAttributes: {{ extraAttributes }}
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapState } from 'vuex'
import searchStoreModule from '@/store/search-store'
# import PromiseButton from '@/components/PromiseButton'
# import PromiseForm from '@/components/PromiseForm'
# import ReadMore from '@/components/ReadMore'
import ResultViewTable from './result-view/ResultViewTable'

export default Vue.extend(
	name: 'ResultView'
	components: { ResultViewTable }
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
#scrollcontainer
	overflow: auto
</style>
