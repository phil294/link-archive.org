import VueRouter from 'vue-router'
import Vue from 'vue'
import V404 from '@/views/404'

Vue.use VueRouter

export create_router = (store) ->
	router = new VueRouter
		mode: 'history'
		base: process.env.BASE_URL
		routes:
			-	path: '/'
				name: 'Index'
				component: => `import('@/views/Index')` # todo this is soon supported natively by cs
			-	path: '/logincallback'
				name: 'LoginCallbackHandler'
				component: => `import('@/views/callback-handlers/LoginCallbackHandler')`
			-	path: '/settings'
				name: 'Settings'
				component: => `import('@/views/secure/Settings')`
				meta:
					requires_auth: true
			-	path: '*'
				component: V404
				meta:
					middlewares:
						-	({ ssr }) =>
								if process.server
									ssr.statusCode = 404
			# corresponding store modules can also be lazyloaded. see ssr vuejs docs
	router.beforeEach (to, from, next) =>
		if to.matched.some (record) => record.meta.requires_auth
			if ! store.getters['session/is_logged_in']
				return next
					path: '/login'
					query:
						redirect: to.fullPath
			else if to.matched.some (record) => record.meta.requires_admin
				if ! store.getters['session/is_admin']
					return next '/'
		next()

	router
