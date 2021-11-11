import Vue from 'vue'

#
###*
@type {Vue.DirectiveHook<HTMLElement>}
This makes the element become position absolute permanently
###
apply = (target, { value: { move_target, onmovestart, onmoveend, snap_back } = {} }) =>
	if move_target == undefined
		move_target = target
	else if move_target == 'parent'
		move_target = target.parentElement
	else if move_target == null
		return

	target.draggable = true
	target.onmousedown = (event) =>

		mouse_start_x = event.pageX
		mouse_start_y = event.pageY

		el_start_left = parseInt(move_target.style.left, 10) or 0
		el_start_top = parseInt(move_target.style.top, 10) or 0

		move_target.style.width = move_target.offsetWidth + "px"
		move_target.style.height = move_target.offsetHeight + "px"
		move_target.style.left = el_start_left + "px"
		move_target.style.top = el_start_top + "px"
		move_target.style.position = 'relative'

		offset_x = 0
		offset_y = 0

		if onmovestart
			onmovestart()

		on_mousemove = (###* @type MouseEvent ### mouse_event) =>
			offset_x = mouse_event.pageX - mouse_start_x
			offset_y = mouse_event.pageY - mouse_start_y
			move_target.style.left = el_start_left + offset_x + 'px'
			move_target.style.top = el_start_top + offset_y + 'px'

		document.addEventListener 'mousemove', on_mousemove
		
		on_mouseup = ->
			document.removeEventListener 'mousemove', on_mousemove
			document.removeEventListener 'mouseup', on_mouseup
			if snap_back
				move_target.style.height = ''
				move_target.style.width = ''
				move_target.style.top = ''
				move_target.style.left = ''
			if onmoveend
				onmoveend
					offset:
						x: offset_x
						y: offset_y
		
		document.addEventListener 'mouseup', on_mouseup
		
		target.ondragstart = => false
	undefined

export default apply