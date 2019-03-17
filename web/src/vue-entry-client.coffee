import Vue from 'vue'
import create_app from './vue-app'

{ app, router, store } = create_app()

# Get on route copmonent reuse: update (/1 to /2 or query param change). not tested
Vue.mixin
    beforeRouteUpdate: (to, from, next) ->
        { async_data_hook } = @$options
        if async_data_hook
            async_data_hook(
                store: @$store
                route: to
            ).then(next)
            .catch(next)
        else
            next()

if window.__INITIAL_STATE__
    store.replaceState window.__INITIAL_STATE__

# Get on route component creation
Vue.mixin
    beforeMount: ->
        { async_data_hook } = @$options
        if async_data_hook
            store.commit 'increase_loading_counter'
            @$async_data_loaded = async_data_hook(
                store: @$store
                route: @$route
            ).finally( =>
                store.commit 'decrease_loading_counter')

router.onReady =>
    app.$mount '#app'