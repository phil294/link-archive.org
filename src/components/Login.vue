<template>
    <div id="login">
        <one-time-button @click="HIDE_LOGIN_MODAL">Close login dialog</one-time-button>
        <one-time-button @click="loginCredentials">Login credentials</one-time-button>
        <div>{{ errorMessage }}</div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { HIDE_LOGIN_MODAL } from '@/store/mutations';
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
        ...mapActions('session', [
            'loginCredentials',
        ]),
        ...mapMutations([
            HIDE_LOGIN_MODAL,
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
