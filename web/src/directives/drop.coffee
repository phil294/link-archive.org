import Vue from 'vue'

Vue.directive('drop',
    bind: (el, { value }) =>
        el.attributes.draggable = true
        el.addEventListener('dragover', e =>
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
        )
        el.addEventListener('drop', e =>
            e.preventDefault()
            data = JSON.parse(
                e.dataTransfer.getData('application/json'))
            value(data)
        )
    unbind: el =>
        el.removeEventListener('dragover')
        el.removeEventListener('drop')
)
