###
 # Client only: This will make console.error, Vue error handler and other
 # uncaught error handlers automatically send out an error report to the server,
 # and display an error banner to the user
 TODO dont show everything to the user, only the first line, with an option to expand the rest
###
export install_error_handler = ({ store, router }) =>
	_console_error = console.error
	depth = 0
	error_handler = (...args) =>
		# debugger
		depth++
		_console_error(...args);
		if depth > 4
			# Only allow two error reports per site load. This also prevents
			# recursive error reportings
			return
		try
			status = args[0]?.status
			if 0 == status
				store.dispatch 'server_unreachable'
				return
			if 401 == status
				store.dispatch 'session/logout'	
				router.push '/login'
				return
			if 500 == status
				store.dispatch 'set_global_error_message',
					'Internal Server Error :-( Sorry! Please try reloading the page!\n\nStatus 500\nAdministrator should have received a notification. We will try to fix this quickly.'
				return
			# ignore_stati = [ 403 ]
			# if ignore_stati.includes status
			# 	return
			error_stringified = [...args]
				.filter Boolean
				.map (s) => """
					#{s.message or s.data or s.msg or s.body} -
					#{s.stack or ''} -
					#{s.toString()} -
					#{(try JSON.stringify s) or s.status or 'Unknown error'} -
					#{s.$options?._componentTag} ---
					#{Error().stack}
				"""
				.join '<br>'
			console.log error_stringified
			# console.trace()
			user_prompt = "An unexpected error happened :-( Sorry! Please try reloading the page!\n\n#{error_stringified}"
			try
				resp = await fetch "#{process.env.VUE_APP_API_ROOT}/error",
					method: "POST"
					headers:
						"Content-Type": "application/json"
					body: JSON.stringify error: error_stringified
				text = await resp.text()
				if resp.status != 200
					throw text
				console.log "succcessful error report status:", text
				user_prompt += "\n\n######### Error was sent to the administrator ✓. We'll check this very soon. #{text} #########"
			catch e1
				console.log "fetch post error failed", e1
				user_prompt += "\n\n######### Error could **NOT** automatically be sent to the administrator. Maybe you are offline. Otherwise, please be so kind to report the error manually. #########"
			try
				store.dispatch 'set_global_error_message', user_prompt
			catch e2
				console.log "global error dispatch failed", e2
		catch e3
			console.log e3
	
	Vue.config.errorHandler = error_handler;
	# ignored in production
	Vue.config.warnHandler = error_handler;
	window.onerror = error_handler;
	console.error = error_handler;
	window.addEventListener('unhandledrejection', (e) => error_handler(e.reason));