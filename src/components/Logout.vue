<template>
    <div id="logout">
        <button @click="logout">logout</button>
    </div>
</template>

<script>
import { SESSION_LOGOUT } from '@/store/mutations';
// const LOGOUT = 'LOGOUT';

export default {
    name: 'Logout',

    data: () => ({

    }),
    computed: {

    },
    methods: {
        logout() {
            this.$store.commit(`session/${SESSION_LOGOUT}`);
        },
    },
};
</script>

<style scoped>
#logout {
    background:lightpink;
}
</style>
