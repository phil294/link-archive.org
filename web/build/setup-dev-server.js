const path = require('path');
const fs = require('fs');
const MFS = require('memory-fs');
const webpack = require('webpack');
const chokidar = require('chokidar');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const clientDevConfig = require('./webpack.dev.client.conf');
const serverDevConfig = require('./webpack.dev.server.conf');

const { log, error } = console;

const readFile = (theFs, file) => theFs
	.readFileSync(path.join(clientDevConfig.output.path, file), 'utf-8');

module.exports = function setupDevServer(app) {
	let bundle;
	let template;
	let clientManifest;

	return new Promise((resolve) => {
		const update = () => {
			if (bundle && clientManifest) {
				resolve({ bundle, template, clientManifest });
			}
		};

		template = fs.readFileSync('./src/index.template.html', 'utf-8');
		chokidar.watch('./src/index.template.html').on('change', () => {
			template = fs.readFileSync('./src/index.template.html', 'utf-8');
			log('index.html template updated.');
			update();
		});

		const clientCompiler = webpack(clientDevConfig);
		const devMiddleware = webpackDevMiddleware(clientCompiler, {
			publicPath: '/dist/',
			// noInfo: true
		});
		app.use(devMiddleware);
		clientCompiler.plugin('done', (stats) => {
			const json = stats.toJson();
			error(json.errors);
			error(json.warnings);
			if (json.errors.length)
				return;
			clientManifest = JSON.parse(readFile(
				devMiddleware.fileSystem,
				'vue-ssr-client-manifest.json',
			));
			update();
		});

		app.use(webpackHotMiddleware(clientCompiler, { heartbeat: 5000 }));

		const serverCompiler = webpack(serverDevConfig);
		const mfs = new MFS();
		serverCompiler.outputFileSystem = mfs;
		serverCompiler.watch({}, (err, stats) => {
			if (err)
				throw err;
			const json = stats.toJson();
			if (json.errors.length)
				return;

			bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
			update();
		});
	});
};
