import Vue from 'vue'

# For testing:
# https://jsfiddle.net/5Lmpxb1r/

###* @typedef {({ data: any, event: DragEvent }) => void} DropCallback ###

###* @typedef {{
	ondragover: (this: HTMLElement, ev: DragEvent) => any
	ondragenter: (this: HTMLElement, ev: DragEvent) => any
	ondragleave: (this: HTMLElement, ev: DragEvent) => any
	ondrop: (this: HTMLElement, ev: DragEvent) => any
	ondrop_cb: DropCallback
}} DragData
###

###* @type {Map<HTMLElement,DragData>} ### 
drag_data_by_el = new Map

set_drop = (###* @type {HTMLElement} ### el, ###* @type {DropCallback} ### drop_cb) =>
	existing_drag_data = drag_data_by_el.get el
	if existing_drag_data
		existing_drag_data.ondrop_cb = drop_cb
		return

	el.classList.add 'drop-target'
	counter = 0
	
	#
	###* @type DragData ###
	drag_data =
		ondragover: (e) ->
			e.preventDefault()
			if e.dataTransfer
				e.dataTransfer.dropEffect = 'move'
		ondragenter: (e) =>
			e.preventDefault() # preventDefaults here are needed? some only for IE. todo
			counter++
			if counter == 1
				el.classList.add 'dragenter'
		ondragleave: =>
			counter--
			if counter == 0
				el.classList.remove 'dragenter'
		ondrop: (e) =>
			e.preventDefault()
			counter = 0
			el.classList.remove 'dragenter'
			try
				data = JSON.parse e.dataTransfer?.getData('application/json') || ''
			catch e
				# TODO stackoverflow.com/q/65775496
				# throw e
				console.warn e
			drag_data.ondrop_cb
				data: data
				event: e
		ondrop_cb: drop_cb
	el.addEventListener 'dragover', drag_data.ondragover
	el.addEventListener 'dragenter', drag_data.ondragenter
	el.addEventListener 'dragleave', drag_data.ondragleave
	el.addEventListener 'drop', drag_data.ondrop

	drag_data_by_el.set el, drag_data

disable_drop = (###* @type {HTMLElement} ### el) =>
	el.classList.remove 'drop-target'
	drag_data = drag_data_by_el.get el
	if not drag_data
		return
	el.removeEventListener 'dragover', drag_data.ondragover
	el.removeEventListener 'dragenter', drag_data.ondragenter
	el.removeEventListener 'dragleave', drag_data.ondragleave
	el.removeEventListener 'drop', drag_data.ondrop
	drag_data_by_el.delete el

#
###* @type {Vue.Directive} ###
directive =
	mounted: (el, { value }) ->
		if value
			set_drop el, value
	updated: (el, { value }) ->
		value = value or null
		if not value
			disable_drop el
		else
			set_drop el, value
	unmounted: (el) ->
		disable_drop el

export default directive
