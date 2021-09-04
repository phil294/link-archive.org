import Vue from 'vue'

#
###* @type {Vue.DirectiveHook<HTMLElement>} ###
updated = (el, { value }) ->
	el.setAttribute 'draggable', !!value
	if value
		el.dataset.drag_value = value

#
###* @type {Vue.Directive<HTMLElement>} ###
directive =
	mounted: (el, binding) ->
		el.addEventListener 'dragstart', (e) =>
			if e.dataTransfer
				e.dataTransfer.setData 'application/json', JSON.stringify(el.dataset.drag_value)
				e.dataTransfer.dropEffect = 'move'
		updated(el, binding)
	updated: updated

export default directive
