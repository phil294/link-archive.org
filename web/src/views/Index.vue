<template lang="slm">
div App v $app_version
</template>

<script lang="coffee">
import { mapState } from 'vuex'

export default
	name: 'Index'
	computed: {
		...mapState [
			'app_version'
		]
	}
</script>
