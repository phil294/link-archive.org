const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

process.env.VUE_APP_APP_VERSION = require('./package.json').version;

process.env.VUE_APP_THEME_PRIMARY_COLOR = '#000000';

const is_production = process.env.NODE_ENV === 'production';

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
      skipWaiting: true
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
  pluginOptions: {
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
      error500Html: './dist/500.html', // TODO this is weird, doesnt work in dev and so on (only updates dist in prod)
      onError: async (s) => {
        console.error(s);
        const stringified = ((()=>{ try { return JSON.stringify(s); } catch(_){} })()) || s.status || 'Unknown error';
        const error_stringified = `SSR BUILD FAILURE ----
            ${s.message || s.data || s.msg || s.body} -
            ${s.stack || ''} -
            ${s.toString()} -
            ${stringified} -
            ${Error().stack}`
        console.log(error_stringified);
        try {
          const resp = await fetch(`${process.env.VUE_APP_API_ROOT}/error`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error_stringified })
          });
          const text = await resp.text()
          if(resp.status !== 200) {
            console.error(`Fetching error failed: ${resp.status}, ${text}`);
          }
        } catch(e1) {
          console.error("fetch post error failed 2: ", e1);
        }
      }
    }
  }
}

function resolve_custom_loader(loader_name) {
	const loader_file = path.join(__dirname, 'custom-loaders', loader_name);
	fs.writeFileSync(`${loader_file}.js`, coffeescript.compile(fs.readFileSync(`${loader_file}.coffee`, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffee loaderscript file directly please fix me. edit: -> https://webpack.js.org/configuration/configuration-languages/
	return loader_file;
};