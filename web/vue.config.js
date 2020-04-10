const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

process.env.VUE_APP_APP_VERSION = require('./package.json').version;

module.exports = {
  productionSourceMap: true, // doesnt work: https://github.com/Akryum/vue-cli-plugin-ssr/issues/84
  css: {
    extract: true,
    sourceMap: true,
  },
  chainWebpack: (config) => {
    config.resolve.extensions
      .add('.coffee')
    
    config
      .devtool('source-map')

    config.module
      .rule('coffee')
        .after('vue')
        .test(/\.coffee$/)
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
      skipWaiting: true
    },
    name: 'MEVN Base InDev',
    themeColor: '#000',
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
  pluginOptions: {
    // TODO: Check these
    // https://vue-cli-plugin-ssr.netlify.com/guide/configuration.html
    ssr: {
      port: 8080,
      defaultTitle: 'MEVN Base Title',
      criticalCSS: false,
      host: '0.0.0.0',
      copyUrlOnStart: false,
      clustered: true, // untested todo
      lruCacheOptions: {
        // See https://ssr.vuejs.org/guide/caching.html
        // TODO
      },
      onError: error => {
        // TODO
      },
      // TODO in public?
      // error500Html: path.resolve(__dirname, './dist/500.html'),
    }
  }
}

function resolve_custom_loader(loader_name) {
	const loader_file = path.join(__dirname, 'custom-loaders', loader_name);
	fs.writeFileSync(`${loader_file}.js`, coffeescript.compile(fs.readFileSync(`${loader_file}.coffee`, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffee loaderscript file directly please fix me. edit: -> https://webpack.js.org/configuration/configuration-languages/
	return loader_file;
};