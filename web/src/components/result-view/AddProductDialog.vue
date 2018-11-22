<template lang="slm">
# :_='
div
	promise-form button-label="Add product" :action=addProduct
		input#name name=name placeholder="Name" required
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'AddProductDialog'
	methods: {
		addProduct: ->
			infos = Object.keys(event.target.elements)
				.reduce((all, el, obj) => 
					all[el] = obj[el.value]
				, {})
			await @$store.dispatch('search/addProduct', infos)
	}
	computed: {
	
	}
)
</script>

<style lang="stylus" scoped>

</style>
