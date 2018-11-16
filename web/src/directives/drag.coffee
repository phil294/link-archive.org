import Vue from 'vue'

Vue.directive('drag',
    bind: (el, { value }) =>
        el.setAttribute('draggable', true)
        el.addEventListener('dragstart', e =>
            e.dataTransfer.setData('application/json',
                JSON.stringify(value))
            e.dataTransfer.dropEffect = 'move'
        )
    unbind: el =>
        el.removeEventListener('dragstart')
)
