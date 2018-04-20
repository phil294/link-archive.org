<template>
    <main> <!-- todo ? -->
        <one-time-button @click="HIDE_LOGIN_MODAL"><i class="material-icons">close</i></one-time-button>
        <h1>Create account or log in</h1>
        <form id="registerOrLogin">
            <fieldset>
                <legend>Your e-mail</legend>
                <input
                    v-model="email"
                    type="email"
                    placeholder="email@example.com">
                <input
                    v-model="password"
                    type="password"
                    placeholder="password">
                <one-time-button
                    id="register"
                    ref="registerButton"
                    @click="registerWithCredentials">
                    Create account<br>
                    <div class="note">
                        <span
                            v-if="passwordStrength===1"
                            class="password-weak">
                            weak
                        </span>
                        <span
                            v-else-if="passwordStrength===2"
                            class="password-medium">
                            medium
                        </span>
                        <span
                            v-else-if="passwordStrength===3"
                            class="password-strong">
                            strong
                        </span>
                        password
                    </div>
                </one-time-button>
                <one-time-button
                    ref="loginButton"
                    @click="loginWithCredentials">Log in</one-time-button>
                <div>{{ errorMessage }}</div>
            </fieldset>
        </form>
    </main>
</template>

<script>
import { mapActions } from 'vuex';
import { HIDE_LOGIN_MODAL, SESSION_LOGIN_CREDENTIALS } from '@/store/actions';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'Login',
    components: {
        OneTimeButton,
    },
    data: () => ({
        errorMessage: '',
        password: '',
        email: '',
    }),
    computed: {
        passwordStrength() {
            // TODO
            return Math.max(1, Math.min(3, Math.round(this.$data.password.length / 2.3)));
        },
    },
    methods: {
        ...mapActions([
            HIDE_LOGIN_MODAL,
        ]),
        loginWithCredentials() {
            this.$data.errorMessage = '';
            this.$store.dispatch(`session/${SESSION_LOGIN_CREDENTIALS}`)
                .catch((e) => {
                    this.$data.errorMessage = e;
                    this.$refs.loginButton.reset();
                });
        },
    },
};
</script>

<style scoped>
main {
    position:fixed;
    z-index:9998;
    top:0;
    left:0;
    padding: 5%;
    width:100%;
    height:100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.8);
}

.password-weak, .password-medium, .password-strong {
    font-weight: bold;
}
.password-weak {
    color: #ff2222;
}
.password-medium {
    color: yellow;
}
.password-strong {
    color: lightgreen;
}
#register > .note { /* fixme */
    text-transform: uppercase;
}
</style>
