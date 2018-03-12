<template>
    <div id="logout">
        <button @click="SESSION_LOGOUT">Logout</button>
    </div>
</template>

<script>
import { SESSION_LOGOUT } from '@/store/mutations';
import { mapMutations } from 'vuex';

export default {
    name: 'Logout',
    methods: {
        ...mapMutations('session', [
            SESSION_LOGOUT,
        ]),
    },
};
</script>

<style scoped>
#logout {
    background:lightpink;
}
</style>
