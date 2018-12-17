<template lang="slm">
# :_='
div
	promise-form button-label="Add product" :action=addProduct
		label
			| Name
			input name=name placeholder=Name required
# '
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend(
	name: 'AddProductDialog'
	methods: {
		...mapActions('search', [
			'addProduct'
		])
	}
)
</script>

<style lang="stylus" scoped>

</style>
