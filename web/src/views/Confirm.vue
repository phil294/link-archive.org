<template lang="slm">
popup.column.center v-if=confirm_prompt @close=confirm_answer(false)
	.prompt.center $confirm_prompt
	.actions.row.center
		button.confirm.btn @click=confirm_answer(true)
			i.material-icons check 
			| Confirm
		button.cancel.btn.btn-2 @click=confirm_answer(false)
			i.material-icons close 
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

<style lang="stylus">
.prompt
	max-width 350px
.cancel
	float right
	margin-left 15px
</style>