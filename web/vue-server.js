import express from 'express';
import Renderer from 'vue-server-renderer';
import fs from 'fs';

const { log } = console;

// ///////////////// CONFIG

/** process.env.[name] or throw */
const getEnv = name => process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`); })();

const server = express();
const renderer = Renderer.createBundleRenderer(serverBundle, {
    template: fs.readFileSync('./src/index.template.html', 'utf-8'),
    runInNewContext: false,
    clientManifest,
});

server.get('*', async (req, res) => {
    const appi = '...';
    let html;
    try {
        html = await renderer.renderToString(app);
    } catch (e) {
        res.status(500).send(e);
    }
    res.end('...');
});

server.listen(getEnv('PORT'), () => log('running'));
