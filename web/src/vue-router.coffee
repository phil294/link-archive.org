import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default ->
	new VueRouter(
		mode: 'history'
		routes: [
			path: '/'
			name: 'Index'
			component: => `import('@/components/Index')`
		,
			path: '/logincallback'
			name: 'LoginCallbackHandler'
			component: => `import('@/components/callback-handlers/LoginCallbackHandler')`
		,
			path: '/secure',
			children: [
				path: 'settings',
				name: 'Settings',
				component: => `import('@/components/secure/Settings')`
			,
			]
			
		
		# corresponding store modules can also be lazyloaded. see ssr vuejs docs

		]
	)
