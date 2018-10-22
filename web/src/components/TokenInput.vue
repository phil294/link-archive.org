<template>
	<div>
		<form id="insert-code" @submit.prevent="loginWithToken()">
			<div>
				<label for="token">paste the token here:</label>
				<input id="token" v-model="tokenModel" type="text" name="token" required>
			</div>
			<button type="submit">Ok</button> <!-- todo onetime? -->
		</form>
		<div v-if="tokenError" class="error fade-in">{{ tokenError }}</div>
	</div>
</template>

<script>
import {
	SESSION_LOGIN_WITH_TOKEN,
} from '@/store/actions';

export default {
	name: 'TokenInput',
	props: {
		token: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			tokenError: '',
			tokenModel: this.$props.token,
		};
	},
	mounted() { // created?
		if (this.$data.tokenModel)
			this.loginWithToken();
	},
	methods: {
		async loginWithToken() {
			this.$data.tokenError = '';
			try {
				this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, this.$data.tokenModel);
				this.$emit('success');
			} catch (error) {
				await this.$nextTick(); // force transition even if follow-up error
				this.$data.tokenError = `Login failed! (${error})`;
			}
		},
	},
};
</script>

<style scoped>
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
