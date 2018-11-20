import Vue from 'vue'

Vue.directive('drop',
	bind: (el, { value }) =>
		counter = 0
		el.addEventListener('dragover', e =>
			e.preventDefault()
			e.dataTransfer.dropEffect = 'move'
		)
		el.addEventListener('dragenter', e =>
			e.preventDefault() # preventdefaults here are needed? some only for IE. todo
			counter++
			if counter == 1
				el.classList.add('drop')
		)
		el.addEventListener('dragleave', e =>
			counter--
			if counter == 0
				el.classList.remove('drop')
		)
		el.addEventListener('drop', e =>
			e.preventDefault()
			counter = 0
			el.classList.remove('drop')
			data = JSON.parse(
				e.dataTransfer.getData('application/json'))
			value(data)
		)
)
