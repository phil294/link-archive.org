import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use VueRouter

export default store ->
	router = new VueRouter
		mode: 'history'
		routes:
			-	path: '/'
				name: 'Index'
				component: => `import('@/components/Index')` # todo this is soon supported natively by cs
			-	path: '/logincallback'
				name: 'LoginCallbackHandler'
				component: => `import('@/components/callback-handlers/LoginCallbackHandler')`
			-	path: '/settings'
				name: 'Settings'
				component: => `import('@/components/secure/Settings')`
				meta:
					requires_auth: true
			-	path: '/p'
				name: 'ResultView'
				component: => `import('@/components/ResultView')`
			# corresponding store modules can also be lazyloaded. see ssr vuejs docs
			-	path: '*'
				redirect: '/'
			# corresponding store modules can also be lazyloaded. see ssr vuejs docs
	router.beforeEach (to, from, next) =>
		if to.matched.some record => record.meta.requires_auth
			if ! store.getters['session/is_logged_in']
				next
					# Example:
					# Possible redirection to login and further
					# path: '/login'
					# query:
					# 	redirect: to.fullPath # In /login: @$router.push @$route.query.redirect || '/'
					# Here, simply redirect to Index: TODO
					path: '/'
			else
				next()
		else
			next()
	router
