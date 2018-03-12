<template>
    <div id="login">
        <one-time-button @clickk="loginCredentials">login</one-time-button>
        <div>{{ errorMessage }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { OneTimeButton } from '@/components/OneTimeButton';

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
        async loginCredentials() {
            this.$store.dispatch('session/loginCredentials');
        },
    },
};
</script>

<style scoped>
#login {
    background:lightsalmon;
}
</style>
