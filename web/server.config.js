export default {
	plugins: [
		'@uvue/server/plugins/gzip',
		'@uvue/server/plugins/modernBuild',
		/* Alternatively, also serverError plugin could be used:
		https://github.com/universal-vue/examples/commit/fe9c3ce06b9a37d7ce13123e31c6973a64bc3c33#diff-e19e62e010f8b5658ed3079d52e22b50702e63b9146dff7de93c9a5d8d38bf72
		but that doesnt offer the ability to further process the errors */
		'./src/server/error-plugin',
		// necessary for serving js assets etc
		'@uvue/server/plugins/static',
	],
	watch: ['src/server/**/*.js'],
}