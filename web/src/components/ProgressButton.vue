<template>
    <button :disabled="loading || disabled" :type="type" @click="clicked">
        <slot v-if="!loading">Click me</slot>
        <span v-else>loading...</span>
    </button>
</template>

<script>
/**
 * todo
 * Button that, when clicked, replaces itself with a loading animation and component fires $click-event. If necessary, .reset() can be called to revert the state. Prop action will be called on click. If it is a promise, loading state will be reverted after it's finished (no matter the outcome)
 */
export default {
    name: 'ProgressButton',
    props: {
        type: {
            type: String,
            default: 'button',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        setLoadingAutomatically: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        loading: false,
    }),
    methods: {
        async clicked() {
            if(this.$props.setLoadingAutomatically)
                this.$data.loading = true;
            this.$emit('click');
        },
        /** Consider using a normal button instead */
        reset() {
            this.$data.loading = false;
        },
        setLoading() {
            this.$data.loading = true;
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
	button {
		display: flex;
		align-items: center;
	}
</style>
