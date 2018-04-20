<template>
    <section id="app">
        <div
            v-if="loginModal"
            id="login">
            <login/>
        </div>
        <header class="padding">
            <nav>
                Navigation etc.
            </nav>
            <div
                v-if="loadingCounter"
                id="loading">
                global-loading-counter-{{ loadingCounter }}
            </div>
            <div
                v-if="isLoggedIn"
                id="loginStatus">
                Logged in as {{ username }}, {{ email }}.
                <one-time-button @click="SESSION_LOGOUT">Logout</one-time-button>
            </div>
            <button
                v-if="!isLoggedIn"
                @click="SHOW_LOGIN_MODAL">Open login dialog
            </button>
        </header>
        <main>
            <router-view/>
            sdfsdf
        </main>
    </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { SHOW_LOGIN_MODAL, SESSION_LOGOUT } from '@/store/actions';
import Login from '@/components/Login';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'App',
    components: {
        Login, OneTimeButton,
    },
    computed: {
        ...mapState([
            'loadingCounter',
            'loginModal',
        ]),
        ...mapState('session', [
            'username',
            'email',
        ]),
        ...mapGetters('session', [
            'isLoggedIn',
        ]),
    },
    methods: {
        ...mapActions([
            SHOW_LOGIN_MODAL,
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
    grid-template-areas: "header"
                         "main";
    grid-template-rows: 50px 1fr;
}
#app > header {
    grid-area: header;
    border-bottom: 1px solid lightgrey;
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
