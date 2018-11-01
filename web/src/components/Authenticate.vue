<template>
	<div id="modal">
		<main class="box padding-xl">
			<button id="close" type="button" @click="HIDE_AUTHENTICATE_MODAL">
				🗙
			</button>
			<!--<h1>Log in or create account</h1>-->
			<div id="register-or-login">

				<fieldset id="with-email" class="box">
					<legend>With e-mail</legend>
					<promise-form v-if="!showMailSent" button-label="Request mail to log in" :action="requestMail">
						<label for="email">E-mail</label>
						<input id="email" v-model="email" type="email" name="email" placeholder="email@example.com" required>
						<read-more class="note" summary="(Why no password?)">
							<p>You can simply login by requesting a login link via E-mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones <a href="TODO">here</a>.</p>
							<p>The main reasons for implementing a password-less login can be found in <a href="https://goo.gl/czxFnf">this article</a>. In short: Passwords are more of a security threat than measurement.</p>
						</read-more>
					</promise-form>
					<div v-else id="mail-sent" class="padding-l">
						<div>
							<p>An e-mail has been sent to <em>{{ email }}</em>.</p>
							<p>You can log in by clicking the link in the e&#8209;mail</p>
							<p class="center"><strong>- OR -</strong></p>
							<token-input @success="HIDE_AUTHENTICATE_MODAL" />
						</div>
						<hr>
						<a @click="showMailSent=false">
							⮜ Send another mail
						</a>
					</div>
				</fieldset>

				<fieldset id="with-external" class="box">
					<legend>Or</legend>
					<div id="google-login">
						<promise-button v-if="googleInitialized" :action="loginWithGoogle">
							<img src="/static/google.png" class="logo">
							Log in with Google
						</promise-button>
						<div v-else class="note">Downloading Google scripts...</div>
					</div>
					<div id="facebook-login">
						<promise-button v-if="facebookInitialized" :action="loginWithFacebook">
							<img src="/static/google.png" class="logo">
							Log in with Facebook
						</promise-button>
						<div v-else class="note">Downloading Facebook scripts...</div>
					</div>
				</fieldset>

			</div>
		</main>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import {
	HIDE_AUTHENTICATE_MODAL, SESSION_REQUEST_TOKEN_MAIL, SESSION_GOOGLE_TOKEN_LOGIN, SESSION_FACEBOOK_TOKEN_LOGIN,
} from '@/store/actions';
import TokenInput from '@/components/TokenInput';
import PromiseButton from '@/components/PromiseButton';
import PromiseForm from '@/components/PromiseForm';
import ReadMore from '@/components/ReadMore';

async function loadGoogle() {
	const gapiScript = document.createElement('script');
	await new Promise((resolve) => {
		gapiScript.onload = () => {
			window.gapi.load('auth2', resolve);
		};
		gapiScript.src = 'https://apis.google.com/js/api.js'; // todo is this functionality available as a module?
		document.head.appendChild(gapiScript);
	});
}
let googleAuth;
async function initializeGoogle() {
	googleAuth = await window.gapi.auth2.init({
		client_id: process.env.GOOGLE_CLIENT_ID,
	});
}
async function loginGoogle() {
	let googleUser;
	try {
		googleUser = await googleAuth.signIn();
	} catch (error) {
		throw error; // new error? todo
	}
	const googleToken = googleUser.getAuthResponse().id_token;
	return googleToken;
}
async function loadFacebook() {
	const fbsdkScript = document.createElement('script');
	await new Promise((resolve, reject) => {
		fbsdkScript.onload = resolve;
		fbsdkScript.onerror = reject; // this throws and is not catched. just like it should (?)
		fbsdkScript.src = 'https://connect.facebook.net/en_US/sdk.js';
		document.head.appendChild(fbsdkScript);
	});
}
async function initializeFacebook() {
	window.fbAsyncInit = () => window.FB.init({
		appId: process.env.FACEBOOK_APP_ID,
		cookie: true,
		xfbml: true,
		version: 'v3.0',
	});
}
async function loginFacebook() {
	let facebookToken;
	try {
		facebookToken = await new Promise((resolve, reject) => {
			window.FB.login((response) => {
				if (response.status === 'connected') {
					resolve(response.authResponse.accessToken);
				} else {
					reject(response);
				}
			});
		});
	} catch (response) {
		throw response; // todo s. google
	}
	return facebookToken;
}

export default {
	name: 'Authenticate',
	components: {
		TokenInput, PromiseButton, PromiseForm, ReadMore,
	},
	data: () => ({
		email: '',
		loading: false,
		showMailSent: false,
		googleInitialized: false,
		facebookInitialized: false,
	}),
	async created() {
		// google: load once, initialize upon component creation
		if (!(window.gapi || {}).auth2) {
			await loadGoogle();
		}
		await initializeGoogle();
		this.$data.googleInitialized = true;
		// facebook: load once, initialize once (needs to happen globally)
		if (!(window.FB || {}).login) {
			await loadFacebook();
			await initializeFacebook();
		}
		this.$data.facebookInitialized = true;
	},
	methods: {
		...mapActions([
			HIDE_AUTHENTICATE_MODAL,
		]),
		async requestMail(event) {
			this.$data.loading = true;
			return this.$store.dispatch(`session/${SESSION_REQUEST_TOKEN_MAIL}`, event.target.elements.email.value) // using form data, not v-model
				.then(() => {
					this.$data.tokenError = '';
					this.$data.showMailSent = true;
				}).finally(() => {
					this.$data.loading = false;
				});
		},
		async loginWithGoogle() {
			const googleToken = await loginGoogle();
			await this.$store.dispatch(`session/${SESSION_GOOGLE_TOKEN_LOGIN}`, googleToken);
			this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
		},
		async loginWithFacebook() {
			// todo factory interface blub
			const facebookToken = await loginFacebook();
			await this.$store.dispatch(`session/${SESSION_FACEBOOK_TOKEN_LOGIN}`, facebookToken);
			this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
		},

	},
};
</script>

<style scoped>
#modal {
	position:fixed;
	z-index:9998;
	top:0;
	left:0;
	padding: 2%;
	width:100%;
	height:100%;
	box-sizing: border-box;
	background: rgba(0,0,0,0.08);
}
main {
	height:100%;
	max-width:400px;
	margin: 0 auto;
	position: relative;
}
fieldset {
	margin-bottom:20px;
}
#close {
	position: absolute;
	top:0 ;
	right:0;
}
#with-external button {
	display: flex;
	align-items: center;
	width:200px;
	margin-bottom:10px;
}
#with-external button img.logo {
	margin-right: 5px;
}
</style>
