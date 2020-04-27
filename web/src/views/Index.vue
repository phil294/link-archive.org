<template lang="slm">
div App v $app_version
</template>

<script lang="coffee">
import { mapState } from 'vuex'

export default
	name: 'Index'
	serverPrefetch: -> # note: docs say: You may find the same fetchItem() logic repeated multiple times (in serverPrefetch, mounted and watch callbacks) in each component - it is recommended to create your own abstraction (e.g. a mixin or a plugin) to simplify such code.
		@fetch_index_data() # axios networking error handler doesnt display ssr: it modifies another component; this serverPrefetch only cares for this very component. Thus, serverPrefetch errors must (and semantically also should) be handled individually
		# In this case: throw (do not catch)
	methods:
		fetch_index_data: ->
			# @$store.dispatch('index_action'),
	computed: {
		index_data_fetched: -> true # this needs to determined by store as actual data is disregarded from ssr->client
		...mapState
			-	'app_version'
	}
	mounted: ->
		if !@index_data_fetched
			@fetch_index_data()
</script>
