<template lang="slm">
div INDEX
</template>

<script lang="coffee">
import Vue from 'vue'

export default Vue.extend(
	name: 'Index'
	asyncData: ({ store }) ->
		# store.dispatch('test')
)
</script>
