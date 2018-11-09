<template lang="slm">
	div.fill
		# result-view-filters
		result-view-table
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
# import PromiseButton from '@/components/PromiseButton'
# import PromiseForm from '@/components/PromiseForm'
# import ReadMore from '@/components/ReadMore'
import ResultViewTable from './result-view/ResultViewTable';

export default Vue.extend(
	name: 'ResultView'
	components: { ResultViewTable }
	asyncData: ({ store }) ->
		store.dispatch('search/search')
	created: ->
		@$store.dispatch('search/search')
)
</script>

<style lang="stylus" scoped>

</style>
