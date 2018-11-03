function appendScript(url) {
	const scriptEl = document.createElement('script');
	return new Promise((resolve, reject) => {
		scriptEl.onload = resolve;
		scriptEl.onerror = reject;
		scriptEl.src = url;
		document.head.appendChild(scriptEl);
	});
}

/** should be abstract */
class ExternalLoginProvider {
	constructor(name) {
		this.name = name;
		this.initialized = false;
	}

	async setup() {
		await this.initialize();
		this.initialized = true;
	}

	/** to be called once at start */
	async load() {}

	/** to be called on component creation (may be multiple times) by .setup() */
	async initialize() {}

	/** @returns token */
	async login() {}
}

const googleLoginProvider = new ExternalLoginProvider('google');
googleLoginProvider.load = async function () {
	await appendScript('https://apis.google.com/js/api.js'); // todo is this functionality available as a module?
	await new Promise((resolve) => {
		window.gapi.load('auth2', resolve);
	});
};
googleLoginProvider.initialize = async function () {
	this.googleAuth = await window.gapi.auth2.init({
		client_id: process.env.GOOGLE_CLIENT_ID,
	});
};
googleLoginProvider.login = async function () {
	const googleUser = await this.googleAuth.signIn();
	return googleUser.getAuthResponse().id_token;
};

const facebookLoginProvider = new ExternalLoginProvider('facebook');
facebookLoginProvider.load = async function () {
	await appendScript('https://connect.facebook.net/en_US/sdk.js');
	window.fbAsyncInit = () => window.FB.init({
		appId: process.env.FACEBOOK_APP_ID,
		cookie: true,
		xfbml: true,
		version: 'v3.0',
	});
};
facebookLoginProvider.login = function () {
	return new Promise((resolve, reject) => {
		window.FB.login((response) => {
			if (response.status === 'connected') {
				resolve(response.authResponse.accessToken);
			} else {
				reject(response);
			}
		});
	});
};

export default [
	googleLoginProvider, facebookLoginProvider,
];
