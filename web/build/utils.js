const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

exports.resolve = dir => path.join(__dirname, '..', dir);

exports.resolve_custom_loader = (loader_name) => {
	const loader_file = path.join(__dirname, 'custom-loaders', loader_name);
	fs.writeFileSync(`${loader_file}.js`, coffeescript.compile(fs.readFileSync(`${loader_file}.coffee`, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffee loaderscript file directly please fix me. edit: -> https://webpack.js.org/configuration/configuration-languages/

	return loader_file;
};

exports.assets_path = _path => path.posix.join('static', _path);
