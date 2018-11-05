import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default ->
	new VueRouter(
		mode: 'history'
		routes: [
			path: '/'
			name: 'Index'
			hidden: true
			component: => `import('@/components/Index')`
		,
			path: '/logincallback'
			name: 'LoginCallbackHandler'
			hidden: true
			component: => `import('@/components/callback-handlers/LoginCallbackHandler')`
		
		# corresponding store modules can also be lazyloaded. see ssr vuejs docs

		]
	)
