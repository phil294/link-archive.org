<template lang="slm">
#search.padding.center.column.padding-xl
	input#search-text v-model=search_text ref=search_text autofocus="" type=search placeholder="Type..."
	aside#settings
		read-more.disabled
			/ form-field v-model=filter_spam type=checkbox label="Filter spam"
			form-field v-model=limit type=number label=Limit
	div v-if=loading
		| Loading...
	div v-if="search_text && !results.length && !loading && !timeout"
		| No results found! Only whole words are matched.
	div v-if=timeout
		| Search timeout. Keep typing...
	ul#results.flex-fill v-if=results.length
		li.row.center v-for="result of results"
			.link-container.flex-fill
				a.title :href="'http://'+result.site" {{ result.title.trim() || "[untitled]" }}
				.urls.row
					a.live-url :href="'http://'+result.site"
						| $result.site
					promise-button :action=open_cache_url_original(result)
						a.cache-url cached
					promise-button :action=open_cache_url_plaintext(result)
						a.cache-url text
					promise-button :action=open_cache_url_no_js(result)
						a.cache-url no-js
					a.archive.cache-url :href="'https://web.archive.org/web/' + result.site"
						| archived
			/ promise-button.spam.btn :action=report_spam(result)
			/ 	| Spam?
	#about v-else=""
		h1 URL Archive
		h2 Start typing above to show results
		/ 472,354 93,505 46,288
		h3 Currently 46,288 unique URLs stored*
		p Your search terms will be matched against all saved URLs *and* titles.<br>No page content. Whole word matches only. Case insensitive.
		p This search engine is dumb. Only exact matches are returned. No synonyms, no content filters, no NLP, no stem words.
		p The order of results is undefined. You cannot sort by anything. Pages are not ranked.
		p Limited support for search operators is available, such as quotes or wildcards. See <a href="https://www.sqlite.org/fts5.html#full_text_query_syntax">FTS5</a>. To query for site or title only, use <code>site:...</code> or <code>title:...</code>, respectively. But you will still be searching for letters only, so site search will not behave as you might expect from other search engines.
		p The results' main links take you to the live page, regardless of whether it is still online.<br>"cached" retrieves the complete page from when it was crawled from Common Crawl. This can take several seconds as it needs to query their servers, but should always result in a response. "text" and "no-js" refer to the same cached snapshot but apply some minimal transforms to it. No guarantee for correctness! But this can help if the normal cached version is unreadable for various reasons. "archived" brings you to the latest capture of the site on <a href="https://archive.org/web/">archive.org</a>, which is unrelated to CC.
		/ p The spam buttons and filter is not implemented yet.
		p This data comes from <a href="https://commoncrawl.org/">Common Crawl</a>.
		p.disabled \ ---------------- * This search engine is in demo state. Possible future versions could hold several billions of urls, including dead and archived ones. --------------
</template>

<script lang="coffee">
import { mapState } from 'vuex'
import { $http } from '@/vue-app.coffee'

search_debouncer = 0

export default
	data: ->
		results: []
		loading: false
		timeout: false
		search_text: ''
		filter_spam: true
		limit: 100
	mounted: ->
		@$store.dispatch 'set_default_focus_target', @$refs.search_text
		@search_text = @$route.query.q or ''
		@limit = @$route.query.l or 100
	methods:
		search: ->
			@loading = true
			@timeout = false
			clearTimeout search_debouncer
			@$router.replace
				query:
					q: @search_text
					l: @limit
			search_debouncer = setTimeout (=>
				try
					@results = (await $http.get '/',
						params:
							q: @search_text
							l: @limit
					).data
				catch e
					if e.status == 400 and e.data == 'timeout'
						@timeout = true
						@loading = false
						@results = []
						return
					throw e
				@loading = false
				# @$store.dispatch 'offer_focus'
			), 100
		open_cache_url: (result, transformer = (x)=>x) ->
			html = (await $http.get 'cached',
				params:
					crawl: result.last_crawl
					site: result.site).data
			html = transformer html
			new_window = window.open()
			new_window?.document.write html
		open_cache_url_original: (result) -> =>
			@open_cache_url result
		open_cache_url_no_js: (result) -> =>
			@open_cache_url result, (html) =>
				html.replace /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, ''
		open_cache_url_plaintext: (result) -> =>
			@open_cache_url result, (html) =>
				tmp = document.implementation.createHTMLDocument("New")
				tmp.write html
				txt = tmp.documentElement.outerText or tmp.documentElement.textContent
				"<pre>#{txt}</pre>"
		report_spam: (result) -> =>
			alert "not yet implemented, sorry!"
	computed: {}
	watch:
		search_text: -> @search()
		limit: -> @search()
</script>

<style lang="stylus" scoped>
#search
	font-family sans
	max-width 100vw
#about
	font-size larger
	font-family monospace
	max-width 600px
	h1
		color #ed4530
input#search-text, aside#settings
	width 700px
	max-width 80vw
input#search-text
	font-family monospace
	&:focus:focus-visible
		outline unset
aside#settings
	font-size small
	.form-field
		flex-direction row
		gap 4px
		:deep(> input:not([type=checkbox]))
			padding 0
			height inherit
			width 40px
			text-align center
ul#results
	max-width 100%
	word-break break-word
	list-style-type none
	white-space nowrap
	overflow-x hidden
	overflow-y auto
	text-overflow ellipsis
	margin 0
	margin-top 20px
	padding 0
	> li
		margin-bottom 10px
		button.spam
			padding 3px
			height 1.5em
		.link-container
			margin-right 1vw
			overflow hidden
		a
			overflow hidden
			text-overflow ellipsis
		a.title
			color #3955ff
		.urls
			font-size small
			gap 1vw
			a
				text-decoration underline
				color unset
			.cache-url
				color var(--color-disabled)
</style>
