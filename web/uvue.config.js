export default {
	paths: {
		main: './src/vue-app',
	},
	plugins: [
		'@uvue/core/plugins/middlewares',
		'@/plugins/nav-loader'
	],
	css: {
		// To further
		// increase inital loading time, the css is extracted into a seperate file
		// here. If desired (so that the "ugly" version is never seen on page load),
		// these can be changed to "inline".
		normal: 'extract',
		vue: 'extract',
	}
}