export default
	# fixme: as soon as the first item gets saved or retrieved, show some stupid cookie banner
	get: (item) => # todo getter setter instead
		JSON.parse localStorage.getItem(item)
	set: (item, value) =>
		if !value
			localStorage.removeItem item
		else
			localStorage.setItem item, JSON.stringify(value)
