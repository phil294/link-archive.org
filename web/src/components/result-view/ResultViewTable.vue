<template lang="slm">
	table
        thead
            th v-for="attribute in attributes" -key=attribute.id
                | {{ attribute.name }}
        tbody
            tr v-for="entry in result" key?
                td v-for="attribute in attributes" -key=attribute.id
                    | {{ entry[attribute] }}

</template>

<script lang="coffee">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend(
	name: 'ResultView'
	# components: { TokenInput, PromiseButton, PromiseForm, ReadMore }
	methods: {
		...mapActions([
			#
		])
    },
    computed: {
        ...mapState('search', [
            'attributes'
            'result'
        ])
    }
)
</script>

<style lang="stylus" scoped>

</style>
