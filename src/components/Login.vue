<template>
    <main> <!-- todo ? -->
        <button type="button" @click="HIDE_LOGIN_MODAL">
            <i class="material-icons">close</i>
        </button>
        <h1>Create account or log in</h1>
        <form id="register-or-login">
            <fieldset>
                <legend>With e-mail</legend>
                <label for="email">E-mail</label>
                <input id="email" v-model="email" type="email" placeholder="email@example.com">
                <label for="password">Password <em>(optional)</em></label>
                <input id="password" v-model="password" type="password" placeholder="password">
                <div id="submit">
                    <one-time-button id="register" ref="registerButton"
                                     @click="registerWithCredentials">
                        Create account
                        <div v-if="password" class="note">
                            <span      v-if="passwordStrength===1" class="password-weak">weak</span>
                            <span v-else-if="passwordStrength===2" class="password-medium">medium</span>
                            <span v-else-if="passwordStrength===3" class="password-strong">strong</span>
                            password
                        </div>
                    </one-time-button>
                    <one-time-button id="login" ref="loginButton"
                                     @click="loginWithCredentials">Log in</one-time-button>
                </div>
                <div id="error" class="error note">{{ errorMessage }}</div>
                <div v-if="showNextStepsRegister" id="next-steps-register">
                    <button class="close" type="button" @click="showNextStepsRegister=false">
                        <i class="material-icons">close</i>
                    </button>
                    <div>
                        An e-mail has been sent to <em>{{ email }}</em>. You can log in by clicking the link in the e-mail.
                    </div>
                </div>
            </fieldset>
        </form>
    </main>
</template>

<script>
import { mapActions } from 'vuex';
import { HIDE_LOGIN_MODAL, SESSION_REGISTER_WITH_CREDENTIALS, SESSION_LOGIN_WITH_CREDENTIALS } from '@/store/actions';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'Login',
    components: {
        OneTimeButton,
    },
    data: () => ({
        password: '',
        email: '',
        errorMessage: '',
        showNextStepsRegister: false,
    }),
    computed: {
        passwordStrength() {
            // TODO
            // https://github.com/dropbox/zxcvbn
            return Math.max(1, Math.min(3, Math.round(this.$data.password.length / 2.3)));
        },
    },
    methods: {
        ...mapActions([
            HIDE_LOGIN_MODAL,
        ]),
        registerWithCredentials() {
            this.$data.errorMessage = '';
            this.$refs.loginButton.setLoading();
            this.$store.dispatch(`session/${SESSION_REGISTER_WITH_CREDENTIALS}`)
                .then(() => {
                    this.$data.showNextStepsRegister = true;
                })
                .catch((error) => {
                    this.$data.errorMessage = error;
                })
                .finally(() => {
                    this.$refs.loginButton.reset();
                    this.$refs.registerButton.reset();
                });
        },
        loginWithCredentials() {
            this.$data.errorMessage = '';
            this.$refs.registerButton.setLoading();
            this.$store.dispatch(`session/${SESSION_LOGIN_WITH_CREDENTIALS}`)
                .then(() => {
                    this.$store.dispatch(HIDE_LOGIN_MODAL, null, { root: true }); // go fkn kys
                })
                .catch((error) => {
                    this.$data.errorMessage = error;
                    this.$refs.loginButton.reset();
                    this.$refs.registerButton.reset();
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
fieldset {
    width: 30%;
    min-width: 340px;
    margin: 0 auto;
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
#submit {
    width: 100%;
}
#login, #register {
    display: inline-block;
}
#submit, #error {
    text-align:center;
}
#register > .note { /* fixme */
text-transform: uppercase;
}
#register-or-login > fieldset {
    position:relative;
}
#next-steps-register {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 5%;
    background:rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
}
#next-steps-register > button.close {
    position:absolute;
    top:0;
    right:0;
}
</style>
