<template>
	<div id="modal">
		<main class="box padding-xl"> <!-- todo ? -->
			<button id="close" type="button" @click="HIDE_AUTHENTICATE_MODAL">
				<i class="material-icons">close</i>
			</button>
			<!--<h1>Log in or create account</h1>-->
			<div id="register-or-login">

				<fieldset id="with-email" class="box">
					<legend>With e-mail</legend>
					<promise-form v-if="!showMailSent" button-label="Request mail to log in" :action="requestMail">
						<label for="email">E-mail</label>
						<input id="email" v-model="email" type="email" name="email" placeholder="email@example.com" required>
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
							<i class="material-icons">keyboard_arrow_left</i> Send another mail
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

let googleAuth; // todo

export default {
	name: 'Authenticate',
	components: {
		TokenInput, PromiseButton, PromiseForm
	},
	data: () => ({
		email: '',
		loading: false,
		showMailSent: false,
		googleInitialized: false,
		facebookInitialized: false,
	}),
	created() {
		// google: load once, initialize upon component creation
		if (!(window.gapi || {}).auth2) {
			this.loadGoogle()
				.then(this.initializeGoogle);
		} else {
			this.initializeGoogle();
		}
		// facebook: load once, initialize once (needs to happen globally)
		if (!(window.FB || {}).login) {
			this.loadFacebook()
				.then(this.initializeFacebook);
		} else {
			this.facebookInitialized = true;
		}
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
		// todo where put this?
		async loadGoogle() {
			const gapiScript = document.createElement('script');
			await new Promise((resolve) => {
				gapiScript.onload = () => {
					window.gapi.load('auth2', resolve);
				};
				gapiScript.src = 'https://apis.google.com/js/api.js'; // todo is this functionality available as a module?
				document.head.appendChild(gapiScript);
			});
		},
		async initializeGoogle() {
			googleAuth = await window.gapi.auth2.init({
				client_id: process.env.GOOGLE_CLIENT_ID,
			});
			this.$data.googleInitialized = true;
		},
		async loginWithGoogle() {
			let googleUser;
			try {
				googleUser = await googleAuth.signIn();
			} catch (error) {
				console.error(error); // todo
				return;
			}
			const googleToken = googleUser.getAuthResponse().id_token;
			await this.$store.dispatch(`session/${SESSION_GOOGLE_TOKEN_LOGIN}`, googleToken);
			this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
		},
		async loadFacebook() {
			const fbsdkScript = document.createElement('script');
			await new Promise((resolve, reject) => {
				fbsdkScript.onload = resolve;
				fbsdkScript.onerror = reject; // this throws and is not catched. just like it should (?)
				fbsdkScript.src = 'https://connect.facebook.net/en_US/sdk.js';
				document.head.appendChild(fbsdkScript);
			});
		},
		initializeFacebook() {
			window.fbAsyncInit = () => window.FB.init({
				appId: process.env.FACEBOOK_APP_ID,
				cookie: true,
				xfbml: true,
				version: 'v3.0', // todo 3.0
			});
			this.$data.facebookInitialized = true;
		},
		async loginWithFacebook() {
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
				console.error(response); // todo
				return;
			}
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
