import Vue from 'vue'

setElValue = (el, { value }) =>
	el.setAttribute('draggable', !!value)
	if value
		el.dataset.dragValue = value

Vue.directive('drag',
	bind: (el, binding) =>
		el.addEventListener('dragstart', e =>
			e.dataTransfer.setData('application/json',
				JSON.stringify(el.dataset.dragValue))
			e.dataTransfer.dropEffect = 'move'
		)
		setElValue(el, binding)
	update: setElValue
		
)
