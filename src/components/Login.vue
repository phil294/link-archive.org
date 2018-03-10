<template>
    <div id="login">
        <button @click="loginCredentials">login</button>
        <div v-if="loginPending">loading</div>
        <div>{{ errorMessage }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Login',

    data: () => ({
        loginPending: false,
    }),
    computed: {
        ...mapState('session', [
            'errorMessage',
        ]),
    },
    methods: {
        async loginCredentials() {
            this.$data.loginPending = true;
            await this.$store.dispatch('session/loginCredentials');
            this.$data.loginPending = false;
        },
    },
};
</script>

<style scoped>
#login {
    background:lightsalmon;
}
</style>
