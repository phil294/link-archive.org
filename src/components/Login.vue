<template>
    <div>
        Logging in...
    </div>
</template>

<script>
import { SESSION_LOGIN_WITH_TOKEN, HIDE_AUTHENTICATE_MODAL } from '@/store/actions';

/** Callback handler for email links, google and alike */
export default {
    name: 'Login',
    created() {
        // in case user entered the link manually while having login modal open
        this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
        if (this.$route.query.token) {
            this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, this.$route.query.token);
            this.$router.push('/');
        }
    },
};
</script>

<style scoped>

</style>
