<template lang="slm">
	div.center.fill
		# result-view-filters
		result-view-table
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
import searchStoreModule from '@/store/search-store'
# import PromiseButton from '@/components/PromiseButton'
# import PromiseForm from '@/components/PromiseForm'
# import ReadMore from '@/components/ReadMore'
import ResultViewTable from './result-view/ResultViewTable';

export default Vue.extend(
	name: 'ResultView'
	components: { ResultViewTable }
	asyncDataHook: ({ store }) ->
		store.registerModule('search', searchStoreModule)
		store.dispatch('search/search')
	destroyed: ->
		@$store.unregisterModule('search')
)
</script>

<style lang="stylus" scoped>

</style>
