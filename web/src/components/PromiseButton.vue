<script>
import Vue from 'vue';
import ProgressButton from './ProgressButton';

/**
 * Pass an `action` to this component that will resolve
 * to a promise. The button will wait for this promise
 * before it resets its loading state.
 */
export default Vue.extend(ProgressButton, {
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
            ProgressButton.clicked().bind(this)
            try {
                await action();
            } finally {
                this.$data.loading = false;
            }
        },
    },
});
</script>