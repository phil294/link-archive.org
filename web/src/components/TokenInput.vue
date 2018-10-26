<template>
	<div>
		<promise-form id="insert-code" button-label="Ok" :action="loginWithToken">
			<label for="token">paste the token here:</label>
			<input id="token" v-model="tokenModel" type="text" name="token" required>
		</promise-form>
	</div>
</template>

<script>
import {
	SESSION_LOGIN_WITH_TOKEN,
} from '@/store/actions';
import PromiseForm from '@/components/PromiseForm';

export default {
	name: 'TokenInput',
	components: {
		PromiseForm,
	},
	props: {
		token: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			tokenModel: this.$props.token,
		};
	},
	mounted() { // created? todo
		if (this.$data.tokenModel)
			this.loginWithToken();
	},
	methods: {
		async loginWithToken() {
			this.$data.tokenError = '';
			this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, this.$data.tokenModel); // throws. todo?
			this.$emit('success');
		},
	},
};
</script>

<style scoped>
/* todo move all to otf */
#insert-code {
    display: flex;
    align-items: flex-end;
}
#insert-code input, #insert-code button {
    height:30px;
}
#insert-code input {
    margin-bottom: 0;
}
</style>
