<script>
import OneTimeButton from './OneTimeButton';

/** todo
 * Button that, when clicked, replaces itself with a loading animation and component fires $click-event. If necessary, .reset() can be called to revert the state. Prop action will be called on click. If it is a promise, loading state will be reverted after it's finished (no matter the outcome)
 */
export default Vue.extends(OneTimeButton, {
    name: 'PromiseButton',
    props: {
        action: {
	    	type: Function,
            required: true // todo
		},
    },
    methods: {
        async clicked() {
            // super.clicked(); // todo
            OneTimeButton.clicked().bind(this)
            try {
                await action();
            } finally {
                this.$data.loading = false;
            }
        },
    },
});
</script>