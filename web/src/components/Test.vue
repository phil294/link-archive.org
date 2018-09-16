<template>
    <div>{{ test.x }}.</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Test',
    asyncData({ store }) {
        return store.dispatch('test');
    },
    computed: {
        ...mapState([
            'test',
        ]),
    },
};
</script>
