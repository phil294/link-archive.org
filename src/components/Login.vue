<template>
    <div>
        <p>Logging in...</p>
        <p class="error">{{ error }}</p>
    </div>
</template>

<script>
import { SESSION_LOGIN_WITH_TOKEN, HIDE_AUTHENTICATE_MODAL } from '@/store/actions';

/** Callback handler for email links, google and alike. todo this shouldnt be called login but callback route */
export default {
    name: 'Login',
    data: () => ({
        error: '',
    }),
    created() {
        // in case user entered the link manually while having login modal open
        this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
        if (this.$route.query.token) {
            try {
                this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, this.$route.query.token);
                this.$router.push('/');
            } catch (error) {
                this.$data.error = `Login failed! (${error})`; // todo duplicate code? authenticate comp
            }
        }
    },
};
</script>

<style scoped>

</style>
