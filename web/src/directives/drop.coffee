import Vue from 'vue'

# For testing:
# https://jsfiddle.net/5Lmpxb1r/

enable_drop = (el) =>
	el.classList.add 'drop-target'
	counter = 0
	
	ondragover = (e) ->
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	el.addEventListener 'dragover', ondragover
	el.__vue_ondragover = ondragover
	
	ondragenter = (e) =>
		e.preventDefault() # preventdefaults here are needed? some only for IE. todo
		counter++
		if counter == 1
			el.classList.add 'dragenter'
	el.addEventListener 'dragenter', ondragenter
	el.__vue_ondragenter = ondragenter

	ondragleave = (e) =>
		counter--
		if counter == 0
			el.classList.remove 'dragenter'
	el.addEventListener 'dragleave', ondragleave
	el.__vue_ondragleave = ondragleave

	ondrop = (e) =>
		e.preventDefault()
		counter = 0
		el.classList.remove 'dragenter'
		try
			data = JSON.parse e.dataTransfer.getData('application/json')
		catch e
			# TODO stackoverflow.com/q/65775496
			throw e
		el.__vue_ondrop_cb(data)
	el.addEventListener 'drop', ondrop
	el.__vue_ondrop = ondrop

disable_drop = (el) =>
	el.removeEventListener 'dragover', el.__vue_ondragover
	el.removeEventListener 'dragenter', el.__vue_ondragenter
	el.removeEventListener 'dragleave', el.__vue_ondragleave
	el.removeEventListener 'drop', el.__vue_ondrop
	el.__vue_ondragover = null
	el.__vue_ondragenter = null
	el.__vue_ondragleave = null
	el.__vue_ondrop = null
	el.classList.remove 'drop-target'

Vue.directive 'drop',
	bind: (el, { value }) ->
		if value
			enable_drop el
			el.__vue_ondrop_cb = value
		else
			el.__vue_ondrop_cb = null
	update: (el, { value }) ->
		value = value or null
		if value == el.__vue_ondrop_cb
			return
		if not value
			if el.__vue_ondrop_cb
				disable_drop el
		else if not el.__vue_ondrop_cb
			enable_drop el
		el.__vue_ondrop_cb = value
	unbind: (el) ->
		disable_drop el
		el.__vue_ondrop_cb = null