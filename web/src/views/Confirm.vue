<template lang="slm">
popup.column.center v-if=confirm_prompt @close=confirm_answer(false)
	.prompt.center $confirm_prompt
	.actions.row.align-center
		button.confirm.btn @click=confirm_answer(true)
			| Confirm
		button.cancel.btn.btn-2 @click=confirm_answer(false)
			| Cancel
</template>

<script lang="coffee">
import { mapActions, mapState } from 'vuex'

export default
	computed: {
		...mapState
			-	'confirm_prompt'
	}
	methods: {
		...mapActions
			-	'confirm_answer'
	}
</script>

<style lang="stylus" scoped>
.prompt
	max-width 350px
	overflow auto
	white-space pre-wrap
.actions
	justify-content space-between
</style>