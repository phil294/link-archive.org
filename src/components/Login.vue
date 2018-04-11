<template>
    <div id="login">
        <h4>login dialog</h4>
        <one-time-button @click="HIDE_LOGIN_MODAL">Close login dialog</one-time-button>
        <one-time-button @click="SESSION_LOGIN_CREDENTIALS">Login with credentials</one-time-button>
        <div>{{ errorMessage }}</div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { HIDE_LOGIN_MODAL, SESSION_LOGIN_CREDENTIALS } from '@/store/actions';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'Login',
    components: {
        OneTimeButton,
    },
    computed: {
        ...mapState('session', [
            'errorMessage',
        ]),
    },
    methods: {
        ...mapActions([
            HIDE_LOGIN_MODAL,
        ]),
        ...mapActions('session', [
            SESSION_LOGIN_CREDENTIALS,
        ]),
    },
};
</script>

<style scoped>
#login {
    position:fixed;
    z-index:9998;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.5);
}
</style>
