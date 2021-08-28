import Vue, { DirectiveFunction } from 'vue'
#
###* @type {DirectiveFunction} ###
update = (el, { value }) ->
	el.setAttribute 'draggable', !!value
	if value
		el.dataset.drag_value = value

Vue.directive 'drag',
	bind: (el, binding) ->
		el.addEventListener 'dragstart', (e) =>
			if e.dataTransfer
				e.dataTransfer.setData 'application/json', JSON.stringify(el.dataset.drag_value)
				e.dataTransfer.dropEffect = 'move'
		update(el, binding)
	update: update