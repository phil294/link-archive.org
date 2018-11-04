const path = require('path');
const coffeescript = require('coffeescript');
const fs = require('fs');

exports.resolve = dir => path.join(__dirname, '..', dir);

exports.resolveCustomLoader = (loaderName) => {
	const loaderFile = path.join(__dirname, 'custom-loaders', loaderName);
	const loaderFileCoffee = `${loaderFile}.coffee`;
	fs.writeFileSync(`${loaderFile}.js`, coffeescript.compile(fs.readFileSync(loaderFileCoffee, 'utf-8'))); // todo I dont know how to tell webpack to accept a coffeefile directly please fix me
	return loaderFile;
};

exports.assetsPath = _path => path.posix.join('static', _path);
