import { createRouter, createWebHistory } from 'vue-router'

export default (store) =>
	router = createRouter
		history: createWebHistory process.env.BASE_URL
		routes: [
			path: '/'
			name: 'Index'
			component: => `import('@/views/Index')` # todo this is soon supported natively by cs
		,
			path: '/logincallback'
			name: 'LoginCallbackHandler'
			component: => `import('@/views/callback-handlers/LoginCallbackHandler')`
		,
			path: '/settings'
			name: 'Settings'
			component: => `import('@/views/secure/Settings')`
			meta:
				requires_auth: true
		,
			path: '/:pathMatch(.*)'
			redirect: '/a'
		# corresponding store modules can also be lazyloaded. see ssr vuejs docs
		]

	router.beforeEach (to, fromm, next) =>
		if to.matched.some (record) => record.meta.requires_auth
			if not store.getters['session/is_logged_in']
				store.dispatch 'session/logout', redirect: to.fullPath
				return
			else if to.matched.some (record) => record.meta.requires_admin
				if ! store.getters['session/is_admin']
					return next '/'
		next()

	router
