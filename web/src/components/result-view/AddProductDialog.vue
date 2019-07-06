<template lang="slm">
div
	promise-form button-label="Add product" :action=add_product
		label
			| Name
			input name=name placeholder=Name required
</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend
	name: 'AddProductDialog'
	methods: {
		...mapActions 'search',
			-	'add_product'
	}
</script>

<style lang="stylus" scoped>

</style>
