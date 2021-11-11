const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

process.env.VUE_APP_APP_VERSION = require('../api/package.json').version;

process.env.VUE_APP_THEME_PRIMARY_COLOR = '#000000';

const is_production = process.env.NODE_ENV === 'production';

/** @type { import("@vue/cli-service").ProjectOptions } */
const options = {
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
      .rule('vue')
        .use('vue-loader')
        .tap((options) => ({
          ...options,
          refSugar: true
        }))
        .end()
      .end()
      .rule('slm')
        .test(/\.slm$/)
        .oneOf('vue-loader')
          .resourceQuery(/^\?vue/)
          .use('slm/loader')
            .loader('vue-slm-lang-loader')
            .end()
          .use('slm/custom-loader')
            .loader(resolve_custom_loader('slm-loader'))
            .end()
        .end()
      .end()
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    directoryIndex: 'null', // TODO test if this actually did anything
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
  }
}
module.exports = options;

function resolve_custom_loader(loader_name) {
  const loader_file = path.join(__dirname, 'custom-loaders', loader_name);
  fs.writeFileSync(`${loader_file}.js`, coffeescript.compile(fs.readFileSync(`${loader_file}.coffee`, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffee loaderscript file directly please fix me. edit: -> https://webpack.js.org/configuration/configuration-languages/
  return loader_file;
};