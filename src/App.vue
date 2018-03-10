<template>
    <section id="app">
        <header class="padding">
            <nav>
                a bc nav
            </nav>
            <div
                v-if="loadingCounter"
                id="loading">
                {{ loadingCounter }}
            </div>
            <div
                v-if="isLoggedIn"
                id="loginStatus">
                bla {{ username }} {{ email }}
                <logout/>
            </div>
            <login v-if="!isLoggedIn" />
        </header>
        <main>
            <router-view/>
        </main>
    </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Login from '@/components/Login';
import Logout from '@/components/Logout';

export default {
    name: 'App',
    components: {
        Login, Logout,
    },
    computed: {
        ...mapState([
            'loadingCounter',
        ]),
        ...mapState('session', [
            'username',
            'email',
        ]),
        ...mapGetters('session', [
            'isLoggedIn',
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
