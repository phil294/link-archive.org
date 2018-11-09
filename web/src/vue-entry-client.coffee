import Vue from 'vue'
import createApp from './vue-app'

{ app, router, store } = createApp()

# Get on route copmonent reuse: update (/1 to /2 or query param change). not tested
Vue.mixin(
    beforeRouteUpdate: (to, from, next) ->
        { asyncDataHook } = @$options
        if asyncDataHook
            asyncDataHook(
                store: @$store
                route: to
            ).then(next)
            .catch(next)
        else
            next()
)

if window.__INITIAL_STATE__
    store.replaceState(window.__INITIAL_STATE__)

# Get on route component creation
Vue.mixin(
    beforeMount: ->
        { asyncDataHook } = @$options
        if asyncDataHook
            store.commit('increaseLoadingCounter')
            @$asyncDataLoaded = asyncDataHook(
                store: @$store
                route: @$route
            ).finally( =>
                store.commit('decreaseLoadingCounter')
            )
)

router.onReady(=>
    app.$mount('#app')
)
