import Vue from 'vue'

Vue.directive 'filedrop',
	bind: (el, { value }) =>
		original_background = ''
		original_opacity = ''
		el.addEventListener 'dragenter', (e) =>
			e.preventDefault()
			e.stopPropagation()
			original_background = el.style.background
			original_opacity = el.style.opacity
			el.style.background = '#9ecbec'
			el.style.opacity = '0.8'
		el.addEventListener 'dragleave', (e) =>
			e.preventDefault()
			e.stopPropagation()
			el.style.background = original_background
			el.style.opacity = original_opacity
		el.addEventListener 'drop', (e) =>
			e.preventDefault()
			e.stopPropagation()
			el.style.background = original_background
			el.style.opacity = original_opacity
			files = e.dataTransfer?.files
			if files?.length
				value files