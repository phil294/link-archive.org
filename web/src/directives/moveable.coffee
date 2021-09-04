import Vue from 'vue'

#
###*
@type {Vue.DirectiveHook<HTMLElement>}
This makes the element become position absolute permanently
###
apply = (target, { value: { move_target } = {} }) =>
	if move_target == undefined
		move_target = target
	else if move_target == null
		return

	target.draggable = true
	target.onmousedown = (event) =>

		mouse_start_x = event.pageX
		mouse_start_y = event.pageY

		el_start_left = move_target.offsetLeft
		el_start_top = move_target.offsetTop

		move_target.style.position = 'absolute'

		on_mousemove = (###* @type MouseEvent ### mouse_event) =>
			move_target.style.left = el_start_left + mouse_event.pageX - mouse_start_x + 'px'
			move_target.style.top = el_start_top + mouse_event.pageY - mouse_start_y + 'px'

		document.addEventListener 'mousemove', on_mousemove
		
		on_mouseup = ->
			document.removeEventListener 'mousemove', on_mousemove
			document.removeEventListener 'mouseup', on_mouseup
		
		document.addEventListener 'mouseup', on_mouseup
		
		target.ondragstart = => false
	undefined

export default apply