import { store } from './vue-app.coffee'

export notify_admin = (text_str) =>
	resp = await fetch "#{process.env.VUE_APP_API_ROOT}/error",
		method: "POST"
		headers:
			"Content-Type": "application/json"
		body: JSON.stringify error: text_str
	text = await resp.text()
	if resp.status != 200
		throw text
	text

export handle_error = (prompt_to_user = true, ...args) =>
	# unfortunately, this doesnt work. chrome's trace() method (also called
	# by error() etc) includes async information that - it seems - CANNOT
	# be retrieved as a variable: SO#56136005. FF doesnt have it at all (?)
	# trace = console.trace()
	trace = Error().stack
	error_stringified = [...args]
		.filter Boolean
		.map (s) => [
			s.message or s.data or s.msg or s.body
			s.enqueue_stack
			s.toString?()
			if not s.$ then try JSON.stringify s
			s.status
			# TODO probably vue 2 only
			s.$options?._componentTag
			s.name
			trace
		].join '<br>\n'
		.join '<br>\n'
	try store_history_str = JSON.stringify([...store.state.store_history].reverse(), null, 2)
	error_stringified += '<br>\n ' + store_history_str
	console.log error_stringified
	# console.trace()
	user_prompt = "An unexpected error happened :-( Sorry! Please try reloading the page!\n\n#{error_stringified}"
	try user_info = store.state.session.session?.name
	error_report = error_stringified + '<br>\nuser: ' + user_info
	try
		# if process.env.NODE_ENV == 'production'
		text = await notify_admin error_report
		console.log "succcessful error report status:", text
		user_prompt += "\n\n######### Error was sent to the administrator ✓. We'll check this very soon. #{text} #########"
	catch e1
		console.log "fetch post error failed", e1
		user_prompt += "\n\n######### Error could **NOT** automatically be sent to the administrator. Maybe you are offline. Otherwise, please be so kind to report the error manually. #########"
	if prompt_to_user
		try
			store.dispatch 'set_global_error_message', user_prompt
		catch e2
			console.log "global error dispatch failed", e2

###
 # This will make console.error, Vue error handler and other
 # uncaught error handlers automatically send out an error report to the server,
 # and display an error banner to the user
 # TODO dont show everything to the user, only an option to expand+show
###
export install_error_handler = ({ app, store }) =>
	_console_error = console.error
	count = 0
	global_error_callback = (...args) =>
		if args[0] == 'ResizeObserver loop limit exceeded' || args[0] == 'ResizeObserver loop completed with undelivered notifications.'
			# Error only visible when window.onerror is overridden???
			# Seems it can just be ignored, see stackoverflow.com/q/49384120
			# Pending issue at https://github.com/Akryum/vue-virtual-scroller/issues/516
			console.warn 'ResizeObserver loop limit exceeded'
			return
		count++
		_console_error(...args, store.state.store_history)
		if count > 15
			return
		try
			utils.whereami 'error encountered'
			status = args[0]?.status
			# failed to fetch is a dropbox error https://github.com/dropbox/dropbox-sdk-js/issues/415
			# Changed from status==0 to message match because axios *itself* can also throw with status 0,
			# e.g. in JSON circular conversion issue.
			if [ 'Network Error', 'Failed to fetch' ].includes args[0]?.message
				return store.dispatch 'server_unreachable'
			if 401 == status or 403 == status
				store.dispatch 'session/logout'	
				return
			if 500 == status
				store.dispatch 'set_global_error_message',
					'Internal Server Error :-( Sorry! Please try reloading the page!\n\nStatus 500\nAdministrator should have received a notification. We will try to fix this quickly.'
				return handle_error false, ...args
			# ignore_stati = [ 403 ]
			# if ignore_stati.includes status
			# 	return
			if args[0]? == undefined and args[1]?._isVue # and args[2]?.??????? == "v-on handler (Promise/async)"
				# I have not been able to identify this error.
				# I assume it is meaningless. The information contained in the mail report
				# is not helpful, so ignore it. But console.trace() might help
				# figuring this out, so until this is cleared up, the debugger will stay
				# (probably now fixed with Vue 3 anyway)
				debugger
				return
			if args[1]?.match? /chrome-extension:\/\//
				return

			await handle_error true, ...args
		catch e3
			console.log e3
	
	app.errorHandler = global_error_callback
	# ignored in production
	app.warnHandler = global_error_callback
	window.onerror = global_error_callback
	console.error = global_error_callback
	window.addEventListener 'unhandledrejection', (e) =>
		# Not doing this results in an extra message printed out on the console
		# *even though* console.error is aliased above. Seems to be internal code.
		# But since that also includes the source file, it is useful for debugging
		# so we dont prevent default.
		# No way to retrieve this for the error report msg? :( stackoverflow.com/q/62765986
		# e.preventDefault()
		global_error_callback e.reason