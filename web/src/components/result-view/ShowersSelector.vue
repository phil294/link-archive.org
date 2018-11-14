<template lang="slm">
	p hi
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'ResultViewShowersSelector'
	methods: {
		...mapActions('search', [
			
		])
	}
	computed: {
		...mapState('search', [
			'attributes'
		])
		...mapGetters('search', [
			
		])
	}
)
</script>

<style lang="stylus" scoped>

</style>
