<template>
    <div id="onetimebutton">
        <button
            :disabled="loading"
            @click="clicked">
            <slot v-if="!loading">
                Click me
            </slot>
            <span v-if="loading">
                loading...
            </span>
        </button>
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
        /** Consider using a normal button instead */
        reset() {
            this.$data.loading = false;
        },
    },
};
</script>

<style scoped>
    /* todo style buttons globally instead */
    #loading {
        background:blue;
        color:aqua;
    }
</style>
