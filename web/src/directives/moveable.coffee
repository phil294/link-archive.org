import Vue from 'vue'

### this makes the element become position absolute permanently ###
Vue.directive 'moveable',
	inserted: (target, { value: { parent } }) =>
		if not parent
			el = target
		else
			el = target.parentElement
		target.draggable = true
		target.onmousedown = (event) =>
			
			mouse_start_x = event.pageX
			mouse_start_y = event.pageY

			el_start_left = el.offsetLeft
			el_start_top = el.offsetTop

			el.style.position = 'absolute'

			on_mousemove = (mouse_event) =>
				el.style.left = el_start_left + mouse_event.pageX - mouse_start_x + 'px'
				el.style.top = el_start_top + mouse_event.pageY - mouse_start_y + 'px'

			document.addEventListener 'mousemove', on_mousemove
			
			on_mouseup = ->
				document.removeEventListener 'mousemove', on_mousemove
				document.removeEventListener 'mouseup', on_mouseup
			
			document.addEventListener 'mouseup', on_mouseup
			
			target.ondragstart = => false