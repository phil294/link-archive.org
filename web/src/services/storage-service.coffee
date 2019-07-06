export default
	get: item => # todo getter setter instead
		JSON.parse localStorage.getItem(item)
	set: (item, value) =>
		if !value
			localStorage.removeItem item
		else
			localStorage.setItem item, JSON.stringify(value)
