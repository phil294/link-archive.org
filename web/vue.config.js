const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

process.env.VUE_APP_APP_VERSION = require('./package.json').version;

process.env.VUE_APP_THEME_PRIMARY_COLOR = '#000000';

const is_production = process.env.NODE_ENV === 'production';

module.exports = {
	productionSourceMap: true,
	css: {
		sourceMap: true,
	},

	chainWebpack: (config) => {
		config
			.entry('app')
			.clear()
			.add('./src/vue-app.coffee')

		config.resolve.extensions
			.add('.coffee')

		config.module
			.rule('coffee')
				.after('vue')
				.test(/\.coffee$/)
					// alternatively, maybe use coffee-loader transpile options? TODO. ...follow https://github.com/cxspxr/vue-cli-plugin-coffee/issues/4
					.use('coffee/babel')
						.loader('babel-loader')
						.end()
					.use('coffee/loader')
						.loader('coffee-loader')
						.end()
					.use('coffee/custom-loader')
						.loader(resolve_custom_loader('coffee-loader'))
						.end()
				.end()
			.rule('slm')
				.after('coffee')
				.test(/\.slm$/)
					.use('slm/loader')
						.loader('slm-loader')
						.end()
					.use('slm/custom-loader')
						.loader(resolve_custom_loader('slm-loader'))
						.end()
				.end()
	},
	pwa: {
		workboxOptions: {
			skipWaiting: true,
			directoryIndex: 'null' // TODO test if this actually did anything
		},
		name: 'MEVN Base InDev',
		themeColor: process.env.VUE_APP_THEME_PRIMARY_COLOR,
		msTileColor: '#FFFFFF',
		manifestOptions: {
			// icons: []
		},
		iconPaths: {
			favicon32: 'img/icons/logo.svg',
			favicon16: 'img/icons/logo.svg',
			appleTouchIcon: false,
			maskIcon: false,
			msTileImage: false
		}
	},
}

function resolve_custom_loader(loader_name) {
	const loader_file = path.join(__dirname, 'custom-loaders', loader_name);
	fs.writeFileSync(`${loader_file}.js`, coffeescript.compile(fs.readFileSync(`${loader_file}.coffee`, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffee loaderscript file directly please fix me. edit: -> https://webpack.js.org/configuration/configuration-languages/
	return loader_file;
};