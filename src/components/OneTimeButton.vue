<template>
    <div id="onetimebutton">
        <button
            v-if="!loading"
            @click="clicked">
            <slot>
                Click me
            </slot>
        </button>
        <div
            v-if="loading"
            id="loading">loading...</div>
    </div>
</template>

<script>
/**
 * Button that, when clicked, replaces itself with a loading animation and component fires $click-event. If necessary, .reset() can be called to revert the state
 */
export default {
    name: 'OneTimeButton',
    data: () => ({
        loading: false,
    }),
    methods: {
        clicked() {
            this.$data.loading = true;
            this.$emit('click');
        },
        reset() {
            this.$data.loading = false;
        },
    },
};
</script>

<style scoped>
    #loading {
        background:blue;
        color:aqua;
    }
</style>
