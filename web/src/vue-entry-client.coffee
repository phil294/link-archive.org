import Vue from 'vue'
import createApp from './vue-app'

{ app, router, store } = createApp()

Vue.mixin(
    beforeRouteUpdate: (to, from, next) ->
        { asyncDataHook } = @$options # not tested
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

router.onReady(=>
    router.beforeResolve((to, from, next) =>
        matched = router.getMatchedComponents(to)
        prevMatched = router.getMatchedComponents(from)

        # non-previously-rendered components:
        diffed = false
        # const activatedAsyncDataHooks = matched
        #    .filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)))
        activatedAsyncDataHooks = matched.filter((c, i) =>
            if diffed
                return diffed
            diffed = prevMatched[i] != c
        )
            .map((c) => c.asyncDataHook || (c.options || {}).asyncDataHook)
            .filter((_) => _)
        if !activatedAsyncDataHooks.length
            return next()

        # call all asyncDataHook()
        # todo loading indicator
        Promise.all(activatedAsyncDataHooks.map((asyncDataHook) =>
            asyncDataHook({ store, route: to })))
            .then(next)
            .catch(next)
            .finally( =>
                # stop loading indicator..??
            )
    )
    app.$mount('#app')
)
