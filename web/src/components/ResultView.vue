<template lang="slm">
	div
		# result-view-filters
		result-view-table
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions } from 'vuex'
# import PromiseButton from '@/components/PromiseButton'
# import PromiseForm from '@/components/PromiseForm'
# import ReadMore from '@/components/ReadMore'
import ResultViewTable from './ResultViewTable';

export default Vue.extend(
	name: 'ResultView'
	components: { ResultViewTable }
	methods: {
		...mapActions([
			#
		])
	}
)
</script>

<style lang="stylus" scoped>

</style>
