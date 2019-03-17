export default
	get: item =>
		JSON.parse localStorage.getItem(item)
	set: (item, value) =>
		if !value
			localStorage.removeItem item
		else
			localStorage.setItem item, JSON.stringify(value)
