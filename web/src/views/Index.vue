<template lang="slm">
#index.padding.column.padding-xl.box.margin-l
	h1 Link Archive
	input#search-text v-model=search_text ref=search_text autofocus="" type=search placeholder="Type..."
	aside#settings
		read-more.disabled
			template #summary=""
				| Limit
			form-field v-model=limit type=number label=Limit
	div v-if=loading
		| Loading...
	div v-if="search_text && !results.length && !loading && !timeout"
		| No results found! Only whole words are matched.
	div v-if=timeout
		| Text too short or complex. Keep typing...
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
	#about v-else=""
		h2 Start typing above to show results
		h3
			| Currently 
			span.highlighted 3,145,487,629
			|  unique URLs stored
		p Your search terms will be matched against all saved URLs *and* titles.<br>No page content. Whole word matches only. Case insensitive.
		p This search engine is dumb. Only exact matches are returned. No synonyms, no content filters, no NLP, no stem words.
		p The order of results is undefined. You cannot sort by anything. Pages are not ranked.
		p The results&apos; main links take you to the live page, regardless of whether it is still online.<br>"cached" retrieves the complete page from when it was crawled from Common Crawl. This can take several seconds as it needs to query their servers. "text" and "no-js" refer to the same cached snapshot but apply some minimal hacky transforms to it. This can help if the normal cached version is unreadable for various reasons. "archived" brings you to the latest capture of the site on <a href="https://archive.org/web/">archive.org</a>, which is unrelated to CC.
		h3 About
		p This data origins from <a href="https://commoncrawl.org/">Common Crawl</a>. More precisely, the <a href="https://commoncrawl.org/2021/11/october-2021-crawl-archive-now-available/">October 2021 crawl archive</a> which contains 22.42 TiB of unprocessed data, compressed (!).
		p While three billion links is certainly a lot, the underlying Common Crawl data does not include the "entire internet". For a more useful search engine, one should also process <a href="https://commoncrawl.org/the-data/get-started/">all existing dumps since 2008</a>, so we can have an actual link Wayback Machine. But that requires a lot more hosting space and time (read: money), so it is not planned for now, unfortunately. But if you want to tackle this, please get in touch!
		h3 Technical infos
		p Everything is <a href="https://github.com/phil294/link-archive.org">Open Source</a>d on GitHub.
		p The URL of this site itself updates whenever you type for any search term. This enables you to share the results.
		p This server is hosted on a not-so-great OpenVZ server slot. The common process to work with CC data is renting computing power at Amazon AWS using EMR, Apache Spark, Hadoop et al (see e.g. <a href="https://github.com/commoncrawl/cc-pyspark">here</a> and <a href="https://tech.marksblogg.com/petabytes-of-website-data-spark-emr.html">here</a>). However, useful parallelization is pretty much impossible with SQLite and there was no hurry, so I made a small <a href="https://github.com/phil294/link-archive.org/blob/master/generate-db">Go script</a> and ran the thing remotely. In total, this took the machine 6&nbsp;days of downloading, 10&nbsp;days of unzipping and 4&nbsp;days of processing/saving.
		p The entire database is a single 480&nbsp;GB SQLite file using FTS5, SQLite&apos;s full text search engine, in a single virtual table. There is no duplication prevention mechanism. Because of that, for future crawls, if ever done, this whole thing needs to be migrated to a database server, but a unique url db index alone will eat up hundreds of gigabytes.
		p When you request a cached version, this directly queries CommonCrawl APIs via Ajax: It asks the <a href="https://index.commoncrawl.org/">index</a> for the WARC file location and then downloads a tiny piece of the respective large <a href="https://commoncrawl.org/the-data/get-started/">crawl chunk</a>, decompresses it and extracts the html. This is also explained <a href="https://groups.google.com/g/common-crawl/c/iZVW5ai9jQI?pli=1">here</a> and <a href="https://gist.github.com/Smerity/56bc6f21a8adec920ebf">here</a>, for example. CC API does not send CORS headers, so proxy is also interposed.
		p I made a custom export of the entire database as a tsv file (tab-separated values, that is: url and site title). It is unfortunately split into two files, but at least each one of those two is internally sorted by url. They are 285&nbsp;/&nbsp;68&nbsp;GB in size in total (53&nbsp;/&nbsp;14&nbsp;GB compressed) and you can download them both <a href="https://api.link-archive.org/db/dump.sorted.1.tsv.gz">here</a> and <a href="https://api.link-archive.org/db/dump.sorted.2.tsv.gz">here</a>.
		p All urls are stored without any <code>https://</code> or <code>www.</code> prefixes. While this can theoretically break a few links, it saves about 7% in db size.
		p There should be limited support for search operators is available, such as quotes or wildcards (see <a href="https://www.sqlite.org/fts5.html#full_text_query_syntax">FTS5</a>) but since the db has detail=none set (which was probably not the best idea), this does not work and would also be throttled by the search timeout.
		p There is a public API that you can use. Feel free to query it directly in fair usage. For any slightly more complicated computations, you will need to get the database mirror above and work with it locally, as all search requests have a small max execution time limit, and you cannot do anything other than search by match term (like this site does). To get to the API, just replace the host <code>link-archive.org</code> with <code>api.link-archive.org</code>.
		h3 Contact
		p I&apos;d love to hear from you, be it ideas, comments or opinions - via <a target="_blank" href="https://waritschlager.de/">here</a> or <a href="mailto:info@link-archive.org">info@link-archive.org</a> or in the <a href="https://news.ycombinator.com/item?id=30108209">HN announcement comments</a> or as a GitHub issue.
		p
			small
				| Created 2022-01-27
</template>

<script lang="coffee">
import { mapState } from 'vuex'
import { $http } from '@/vue-app.coffee'
import pako from 'pako'

search_debouncer = 0

cached_cache = new Map

export default
	data: ->
		results: []
		loading: false
		timeout: false
		search_text: ''
		limit: 20
	mounted: ->
		@$store.dispatch 'set_default_focus_target', @$refs.search_text
		@search_text = @$route.query.q or ''
		@limit = @$route.query.l or 20
	methods:
		search: ->
			@loading = true
			@timeout = false
			clearTimeout search_debouncer
			@$router.replace
				query:
					q: @search_text
					l: @limit
			if not @search_text
				@loading = false
				@results = []
				return
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
			), 300
		open_cache_url: (result, transformer = (x)=>x) ->
			get_cache_content = =>
				## also requires you to wrap the uri in `encodeURIComponent`:
				# cors_proxy_prefix_url = "https://jsonp.afeld.me/?url="

				# custom hosted. whitelist for https://link-archive.org and http://localhost:8080 configured, but haven't tested that
				cors_proxy_prefix_url = 'https://link-archive-cors-proxy.herokuapp.com/'

				url = cors_proxy_prefix_url + "http://index.commoncrawl.org/CC-MAIN-2021-43-index?" + new URLSearchParams(
					url: result.site
					output: 'json')
				cached_cached = cached_cache.get(url)
				if cached_cached
					return cached_cached
				
				response = await fetch url
				json = (await response.text())
					.split('\n').filter(Boolean)
					.map((line) =>
						try
							return JSON.parse(line)
						catch
							return JSON.parse(line.slice(line.indexOf('{'))))
					.find((j) => j.status*1 == 200)
				
				response = await fetch cors_proxy_prefix_url + "https://commoncrawl.s3.amazonaws.com/#{json.filename}",
					headers:
						Range: "bytes=#{json.offset}-#{json.offset*1 + json.length*1 - 1}"
				gzipped_buffer = await response.arrayBuffer()

				gunzipped_buffer = pako.inflate gzipped_buffer
				lines = new TextDecoder().decode(gunzipped_buffer).split('\n')
				
				c_blank_line = 0
				i = 0
				while i < lines.length
					if lines[i] == '' or lines[i] == '\r'
						c_blank_line++
					if c_blank_line == 2
						break
					i++
				text = lines.slice(i).join('\n')

				cached_cache.set(url, text)
				return text
			
			try
				content = await get_cache_content()
			catch e
				alert 'Could not reach CommonCrawl API for cached version. Please try again, it often works on second attempt.\n\nError message: ' + [e.message, e.status, e.data].join(', ')
				console.error e
				return
			html = transformer content
			new_window = window.open()
			if new_window
				new_window.document.write html
			else
				alert 'Fetching cached version successful! Please click the the button again to open the page.'
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
	computed: {}
	watch:
		search_text: -> @search()
		limit: -> @search()
</script>

<style lang="stylus" scoped>
#index
	max-width 100vw
	font-size larger
	min-height fit-content
	font-family monospace
	h1
		color #ed4530
		margin 0 0 1.2vh
#about
	max-width 600px
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
	font-family sans
	font-size smaller
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
		.link-container
			margin-right 1vw
			overflow hidden
		a
			overflow hidden
			text-overflow ellipsis
		a.title
			color #2739a4
		.urls
			font-size small
			gap 1vw
			a
				text-decoration underline
				color unset
			.cache-url
				color var(--color-disabled)
</style>
