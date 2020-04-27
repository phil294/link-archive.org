export default
	# fixme: as soon as the first item gets saved or retrieved, show some stupid cookie banner
	get: (item) -> # todo getter setter instead
		JSON.parse localStorage.getItem(item)
	set: (item, value) ->
		if !value
			localStorage.removeItem item
		else
			cookies_accepted = @get 'cookies_accepted'
			if not cookies_accepted
				# TODO: link to privacy policy
				if not confirm """
					COOKIE WARNING
					
					This action will store cookies and/or local storage data in your browser. Do you agree?
					
					If you accept, you will not be asked again.
					If you deny, some things may not work as expected.
				"""
					throw new Error 'Cookie consent denied'
				localStorage.setItem 'cookies_accepted', 1
			localStorage.setItem item, JSON.stringify(value)
