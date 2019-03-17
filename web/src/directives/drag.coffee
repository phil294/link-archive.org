import Vue from 'vue'

set_el_value = (el, { value }) =>
	el.setAttribute 'draggable', !!value
	if value
		el.dataset.drag_value = value

Vue.directive 'drag',
	bind: (el, binding) =>
		el.addEventListener 'dragstart', e =>
			e.dataTransfer.setData 'application/json', JSON.stringify(el.dataset.drag_value)
			e.dataTransfer.dropEffect = 'move'
		set_el_value el, binding
	update: set_el_value