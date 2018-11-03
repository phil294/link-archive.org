<template>
	<div id="modal">
		<main class="box padding-xl">
			<button id="close" type="button" @click="hideAuthenticateModal">
				🗙
			</button>
			<!--<h1>Log in or create account</h1>-->
			<div id="register-or-login">

				<fieldset id="with-email" class="box">
					<legend>With email</legend>
					<div v-if="!showMailSent">
						<promise-form button-label="Request mail to log in" :action="requestMail">
							<label for="email">Email</label>
							<input id="email" v-model="email" type="email" name="email" placeholder="email@example.com" required>
						</promise-form>
						<read-more class="note" summary="(Why no password?)">
							<p>You can simply login by requesting a login link via mail. If you are afraid someone else might have gained access to the login link, you can invalidate all current ones <a href="TODO">here</a>.</p>
							<p>The main reasons for implementing a password-less login can be found in <a href="https://goo.gl/czxFnf">this article</a>. In short: Passwords are more of a security threat than measurement.</p>
							<p>If you feel you <em>really</em> need to use a password, you can configure one in the account settings once you are logged in.</p>
						</read-more>
					</div>
					<div v-else id="mail-sent" class="padding-l">
						<div>
							<p>An email has been sent to <em>{{ email }}</em>.</p>
							<p>You can log in by clicking the link in the email</p>
							<p class="center"><strong>- OR -</strong></p>
							<token-input @success="hideAuthenticateModal" />
						</div>
						<hr>
						<a @click="showMailSent=false">
							⮜ Send another mail
						</a>
					</div>
				</fieldset>

				<fieldset id="with-external" class="box">
					<legend>Or</legend>
					<div v-for="provider in externalLoginProviders" :key="provider.name">
						<promise-button v-if="provider.initialized" :action="externalLogin(provider)">
							<img :src="'static/'+provider.name+'.png'" class="logo">
							Log in with {{ provider.name }}
						</promise-button>
						<div v-else class="note">Loading {{ provider.name }} login scripts...</div>
					</div>
				</fieldset>

			</div>
		</main>
	</div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import TokenInput from '@/components/TokenInput';
import PromiseButton from '@/components/PromiseButton';
import PromiseForm from '@/components/PromiseForm';
import ReadMore from '@/components/ReadMore';
import externalLoginProviders from '@/external-login-providers';

export default Vue.extend({
	name: 'Authenticate',
	components: {
		TokenInput, PromiseButton, PromiseForm, ReadMore,
	},
	data: () => ({
		email: '',
		loading: false,
		showMailSent: false,
		externalLoginProviders,
	}),
	async created() {
		if (!window.loadedExternalLoginProviders)
			window.loadedExternalLoginProviders = {};
		this.$data.externalLoginProviders.forEach(async (provider) => {
			if (!window.loadedExternalLoginProviders[provider.name]) {
				await provider.load();
				window.loadedExternalLoginProviders[provider.name] = true;
			}
			await provider.setup();
		});
	},
	methods: {
		...mapActions([
			'hideAuthenticateModal',
		]),
		async requestMail(event) {
			this.$data.loading = true;
			return this.$store.dispatch('session/requestTokenMail', event.target.elements.email.value) // using form data, not v-model
				.then(() => {
					this.$data.tokenError = '';
					this.$data.showMailSent = true;
				}).finally(() => {
					this.$data.loading = false;
				});
		},
		externalLogin(provider) {
			return async () => {
				const token = await provider.login();
				await this.$store.dispatch('session/externalLoginProviderLoginWithToken', {
					token, // todo can this throw?
					providerName: provider.name,
				});
				this.$store.dispatch('hideAuthenticateModal');
			};
		},

	},
});
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
