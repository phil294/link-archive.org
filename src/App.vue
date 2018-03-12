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
                <logout/>
            </div>
            <div v-if="!isLoggedIn && !loginModal">
                <one-time-button @click="SHOW_LOGIN_MODAL">Open login dialog</one-time-button>
            </div>
        </header>
        <main>
            <router-view/>
        </main>
    </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { SHOW_LOGIN_MODAL } from '@/store/mutations';
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'App',
    components: {
        Login, Logout, OneTimeButton,
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
        ...mapMutations([
            SHOW_LOGIN_MODAL,
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
