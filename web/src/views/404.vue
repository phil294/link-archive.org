<template lang="slm">
.center.padding-xl
	article.padding-xl.box
		h2 404 – Page not found
		router-link to=/ Return to main page
</template>

<script lang="coffee">
export default
	metaInfo:
		title: '404 Not found – Site title'
</script>

<style lang="stylus" scoped>
article
	max-width 600px
</style>
