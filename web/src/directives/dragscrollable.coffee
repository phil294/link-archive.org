import Vue from 'vue'

apply = (target, { value: { scroll_target, on_dragscroll_start, on_dragscroll_end } = {} }) =>
	if scroll_target == undefined
		scroll_target = target
	else if scroll_target == null
		return
	
	target.onmousedown = (event) =>
		if (event.path or event.composedPath()).some (el) => el.draggable or ['input','textarea'].includes el.tagName?.toLowerCase?()
			return
		event.stopPropagation()

		mouse_start_x = event.pageX
		mouse_start_y = event.pageY

		start_scroll_left = scroll_target.scrollLeft
		start_scroll_top = scroll_target.scrollTop

		did_move = false

		on_mousemove = (mouse_event) =>
			if not did_move and on_dragscroll_start
				on_dragscroll_start()
			did_move = true
			scroll_target.scrollLeft = start_scroll_left + mouse_start_x - mouse_event.pageX
			scroll_target.scrollTop = start_scroll_top + mouse_start_y - mouse_event.pageY

		document.addEventListener 'mousemove', on_mousemove

		on_mouseup = ->
			document.removeEventListener 'mousemove', on_mousemove
			document.removeEventListener 'mouseup', on_mouseup
			if on_dragscroll_end
				# Should wait here until possible click event handlers are done
				# before saying the drag event is over, in case the parent
				# toggles its click handlers with these callbacks
				await new Promise (ok) => setTimeout(ok, 0)
				on_dragscroll_end()

		document.addEventListener 'mouseup', on_mouseup
		
Vue.directive 'dragscrollable',
	inserted: apply
	update: apply