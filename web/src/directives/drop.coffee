import Vue from 'vue'

# This seems to be necessary as directives are pretty much stateless.
# And the callback needs to reside somewhere as it can update or change.
callbacks = new Map

Vue.directive 'drop',
	bind: (el, { value }) ->
		counter = 0
		el.addEventListener 'dragover', (e) ->
			e.preventDefault()
			e.dataTransfer.dropEffect = 'move'
		el.addEventListener 'dragenter', (e) =>
			e.preventDefault() # preventdefaults here are needed? some only for IE. todo
			counter++
			if counter == 1
				el.classList.add 'drop'
		el.addEventListener 'dragleave', (e) =>
			counter--
			if counter == 0
				el.classList.remove 'drop'
		el.addEventListener 'drop', (e) =>
			e.preventDefault()
			counter = 0
			el.classList.remove 'drop'
			data = JSON.parse e.dataTransfer.getData('application/json')
			callbacks.get(el)(data)
		callbacks.set(el, value)
	update: (el, { value }) ->
		callbacks.set(el, value)
	unbind: (el) ->
		callbacks.delete(el)