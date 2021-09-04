import dayjs from 'dayjs'
import { store } from './vue-app.coffee'

intl_number_format = new Intl.NumberFormat 'de-DE', # TODO why de? shouldnt this be browser/locale dependent?
		{ style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
intl_number_format_currency = new Intl.NumberFormat 'de-DE',
	{ style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }

# todo use https://stackoverflow.com/a/52273870/3779853 instead once this version is working
blob_download_util_anchor = document.createElement "a"
document.body.appendChild blob_download_util_anchor
blob_download_util_anchor.style = 'display: none'
blob_download_util_url = null

export default
	### changes e.g. 100.00000000000001 to 100 ###
	strip_float: (n) =>
		Number(parseFloat(n).toPrecision(11))
		# alternative
		#Math.round(n * 10000000000) / 10000000000

	to_datestring: (v) =>
		d = dayjs(v or '')
		if not d.isValid()
			return ''
		return d.format 'YYYY-MM-DD'

	to_locale_datestring: (v) =>
		d = dayjs(v or '')
		if not d.isValid()
			return ''
		return d.format 'DD.MM.YYYY'
		
	date_to_time: (date) =>
		if not date
			return '?'
		dayjs(date).format 'HH:mm'

	format_minutes: (minutes) =>
		if not minutes
			return '00:00'
		hours = Math.floor(minutes / 60)
		hours = (''+hours).padStart 2, '0'
		minutes = Math.round(minutes - hours * 60)
		minutes = (''+minutes).padStart 2, '0'
		"#{hours}:#{minutes}"

	format_seconds: (seconds) =>
		if not seconds
			return '00:00:00'
		hours = Math.floor(seconds / 3600)
		hours = (''+hours).padStart 2, '0'
		minutes = Math.floor((seconds - hours * 3600) / 60)
		minutes = (''+minutes).padStart 2, '0'
		seconds = seconds - hours * 3600 - minutes * 60
		seconds = (''+seconds).padStart 2, '0'
		"#{hours}:#{minutes}:#{seconds}"

	format_number: (number) =>
		if not number
			return '0'
		intl_number_format.format number
	format_currency: (n) =>
		intl_number_format_currency.format n
	# TODO: should also use intl
	format_fraction: (fr) =>
		Math.round(Math.min(1, fr) * 100) + ' %'

	html_escape: (s) =>
		s.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')

	### credits to Peheje https://stackoverflow.com/a/38552302/3779853 ###
	parse_jwt: (token) => JSON.parse(decodeURIComponent(atob(token.trim().split('.')[1].replace(/-/g,'+').replace(/_/g,'/')).split('').map((c)=>"%"+('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))

	Queue: class
		constructor: (@max_concurrent_jobs) ->
			@queue = []
			@queue_running = 0

		### add a method to the execution queue and start executing it
		immediately if it isnt running already. ###
		enqueue: (method) ->
			stack = Error().stack
			wrapped_method = null
			# so we can return this enqueue call after method() is finished
			# the call to method however happens from within run_queue
			wait_for_method = new Promise (ok, not_ok) =>
				wrapped_method = =>
					try
						ok await method()
					catch e
						not_ok e
						# But do not throw: The wrapped_method (to be run from Q)
						# will never throw, so that the Q can go on either way
						# But by running not_ok, the enqueue() parent will get the
						# exception thrown
			@queue.push wrapped_method
			if @queue_running < @max_concurrent_jobs
				# run the queue immediately. the queue start could also be
				# triggered by the user or after a delay or etc.
				# Maybe make this configurable?
				# But do not await the entire queue here, ...
				@run_queue()
			# ... only wait for the passed method
			try
				await wait_for_method
			catch e
				# This workaround is necessary (for better debugging) because
				# of the stuff explained about console.trace() in vue-app
				e.enqueue_stack = stack
				throw e

		run_queue: ->
			@queue_running++
			# this could also be configurable:
			store.commit 'increase_loading_counter'
			while next_method = @queue.shift()
				await next_method()
			@queue_running--
			store.commit 'decrease_loading_counter'

	### without redirecting the user anywhere, just open up the file ###
	download_blob: (blob, filename) =>
		if blob_download_util_url
			window.URL.revokeObjectURL blob_download_util_url
		blob_download_util_url = window.URL.createObjectURL blob
		blob_download_util_anchor.href = blob_download_util_url
		blob_download_util_anchor.download = filename
		blob_download_util_anchor.click()

	sleep: (ms) => new Promise (ok) => setTimeout(ok, ms)

	ascii_nest: (v, nest_level) =>
		"#{if nest_level then '└' + '─'.repeat(nest_level - 1) else ''}
		#{v}"