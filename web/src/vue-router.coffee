import { createRouter, createWebHistory } from 'vue-router'

export default (store) =>
	router = createRouter
		history: createWebHistory process.env.BASE_URL
		routes: [
			path: '/'
			name: 'Index'
			component: => `import('@/views/Index')` # todo this is soon supported natively by cs
		,
			path: '/:pathMatch(.*)'
			redirect: '/'
			# corresponding store modules can also be lazyloaded. see ssr vuejs docs
		]

	router
