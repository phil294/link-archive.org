const express = require('express');
const Renderer = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');

const { log, error } = console;

const isProd = process.env.NODE_ENV === 'production';

/** process.env.[name] or throw */
const getEnv = name => process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`); })();

const server = express();

/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */

let renderer;

if (isProd) {
	const serverBundle = require('./dist/vue-ssr-server-bundle.json');
	const template = fs.readFileSync('./src/index.template.html', 'utf-8');
	const clientManifest = require('./dist/vue-ssr-client-manifest.json');
	renderer = Renderer.createBundleRenderer(serverBundle, { // todo hackernews also contains lru cache here
		template,
		clientManifest,
		runInNewContext: false,
		basedir: path.resolve(__dirname, './dist'),
	});
	log('production renderer initialized');
} else {
	require('./build/setup-dev-server.js')(server).then(
		({ bundle, template, clientManifest }) => {
			log('dev renderer initialized');
			const prefetchload = true; // for debugging purposes, deactivable (todo in prod in internet save mode too..?)
			renderer = Renderer.createBundleRenderer(bundle, {
				template,
				clientManifest,
				runInNewContext: false,
				shouldPrefetch: prefetchload ? false : () => false,
				shouldPreload: prefetchload ? false : () => false,
			});
		},
	);
}

const serve = where => express.static(path.resolve(__dirname, where));

// app.use(compression({ threshold: 0 });
// use favicon bla
server.use('/dist', serve('./dist'));
server.use('/static', serve('./static'));
// server.use('/manifest.json', serve('./manifest.json')); // ?

server.get('*', async (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	let html;
	try {
		html = await renderer.renderToString({
			title: 'ka  title', // TODO
			url: req.url,
		});
	} catch (e) {
		if (e.url)
			return res.redirect(e.url);
		if (e.code === 404)
			return res.status(404).end();
		return res.status(500).send(e.message);
	}
	return res.send(html);
});

server.listen(getEnv('PORT'), () => log('running'));
