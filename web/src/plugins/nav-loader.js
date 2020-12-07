import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'

export default {
	beforeCreate() {
		if (process.client) {
			// TODO: dont use a npm package for this, and integrate with axios
			// and chunk loading requests so progress can be tracked accurately
			Vue.use(VueProgressBar, {
				// Sync with global vars from global.stylus
				color: 'darkorange',
				failedColor: 'darkred',
				thickness: '2px',
			})
		}
	},

	beforeStart({ app, router }) {
		if (process.client) {
			// On boot start progress
			app.$Progress.start()

			// On route change start progress
			router.beforeEach((to, from, next) => {
				app.$Progress.start()
				next()
			})

			// On route rendered: stop
			router.afterEach(() => {
				app.$Progress.finish()
			})

			// On route error: fail
			router.onError(() => {
				app.$Progress.fail()
			})

			// On redirect: stop
			app.$on('router.redirect', () => {
				app.$Progress.finish()
			})
		}
	},

	catchError({ app }) {
		if (process.client) {
			app.$Progress.fail()
		}
	},

	// On route error: fail
	routeError({ app }) {
		if (process.client) {
			app.$Progress.fail()
		}
	},

	// When all is ready: stop
	ready({ app }) {
		if (process.client) {
			app.$Progress.finish()
		}
	},
}
