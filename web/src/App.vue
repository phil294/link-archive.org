<template>
	<section id="app">
		<div
			v-if="authenticateModal"
			id="authenticate-modal"
			class="fade-in">
			<authenticate />
		</div>
		<header class="padding">
			<nav>
				<h2 link??>{{ appName }}</h2>
				<div>Navigation</div>
				<div>etc.</div>
			</nav>
			<div
				v-if="loadingCounter"
				id="loading">
				global-loading-counter-{{ loadingCounter }}
			</div>
			<div
				v-if="isLoggedIn"
				id="loginStatus">
				Logged in as
				<span v-if="session.name">{{ session.name }}</span>
				<span v-else-if="session.email">{{ session.email }}</span>
				<span v-else-if="session.externalType">{{ session.externalIdentifier }} [{{ session.externalType }}]</span>
				<one-time-button @click="SESSION_LOGOUT">Logout</one-time-button>
			</div>
			<button
				v-if="!isLoggedIn"
				@click="SHOW_AUTHENTICATE_MODAL">Authenticate
			</button>
		</header>
		<main>
			<router-view />
		</main>
	</section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { SHOW_AUTHENTICATE_MODAL, SESSION_LOGOUT } from '@/store/actions';
import Authenticate from '@/components/Authenticate';
import OneTimeButton from '@/components/OneTimeButton';

export default {
	name: 'App',
	components: {
		Authenticate, OneTimeButton,
	},
	computed: {
		...mapState([
			'appName',
			'loadingCounter',
			'authenticateModal',
		]),
		...mapState('session', [
			'session',
		]),
		...mapGetters('session', [
			'isLoggedIn',
		]),
	},
	methods: {
		...mapActions([
			SHOW_AUTHENTICATE_MODAL,
		]),
		...mapActions('session', [
			SESSION_LOGOUT,
		]),
	},
};
</script>

<style scoped>
#app {
	display:grid;
	width: 100%;
	height: 100%;
	grid-template-areas:	"header"
							"main";
	grid-template-rows: 50px 1fr;
}
#app > header {
	grid-area: header;
	border-bottom: 1px solid lightgrey; /* todo should this be done with an hr element? grid disapproves */
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
#loading {
	flex: 1;
	background: lightblue;
	text-align:center;
}
#app > main {
	grid-area: main;
}
</style>
