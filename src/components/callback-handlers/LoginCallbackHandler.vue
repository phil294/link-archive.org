<template>
    <token-input :token="$route.query.token" @success="redirect()" />
</template>

<script>
import { HIDE_AUTHENTICATE_MODAL } from '@/store/actions';
import TokenInput from '@/components/TokenInput';

/** Route '/logincallback': "Callback" handler for email links, google and alike. */
export default {
    name: 'LoginCallbackHandler',
    components: {
        TokenInput,
    },
    created() {
        this.$store.dispatch(HIDE_AUTHENTICATE_MODAL); // in case user entered the link manually while having login modal open
    },
    methods: {
        redirect() {
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>

</style>
