<template>
    <div id="modal">
        <main class="box padding-l"> <!-- todo ? -->
            <button id="close" type="button" @click="HIDE_AUTHENTICATE_MODAL">
                <i class="material-icons">close</i>
            </button>
            <h1>Log in or create account</h1>
            <div id="register-or-login">
                <fieldset id="with-email" class="box">
                    <legend>With e-mail</legend>
                    <form v-if="!showNextSteps" @submit.prevent="requestMail($event)">
                        <label for="email">E-mail</label>
                        <input id="email" v-model="email" type="email" name="email" placeholder="email@example.com" required>
                        <button :disabled="loading" type="submit">Request mail to log in</button>
                    </form>
                    <div v-else id="next-steps" class="padding-l">
                        <div>
                            <p>An e-mail has been sent to <em>{{ email }}</em>.</p>
                            <p>You can log in by clicking the link in the e-mail</p>
                            <p class="center"><strong>- OR -</strong></p>
                            <form id="insert-code" @submit.prevent="loginWithToken($event)">
                                <div>
                                    <label for="token">paste the code here:</label>
                                    <input id="token" type="text" name="token" required>
                                </div>
                                <button type="submit">Ok</button>
                            </form>
                            <div class="error">{{ tokenError }}</div>
                        </div>
                        <br>
                        <a @click="showNextSteps=false">
                            Send another mail
                        </a>
                    </div>
                </fieldset>
            </div>
        </main>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { HIDE_AUTHENTICATE_MODAL, SESSION_REQUEST_TOKEN_MAIL, SESSION_LOGIN_WITH_TOKEN } from '@/store/actions';
import OneTimeButton from '@/components/OneTimeButton';

export default {
    name: 'Authenticate',
    components: {
        OneTimeButton,
    },
    data: () => ({
        email: '',
        loading: false,
        showNextSteps: false,
        tokenError: '',
    }),
    methods: {
        ...mapActions([
            HIDE_AUTHENTICATE_MODAL,
        ]),
        requestMail(event) {
            this.$data.loading = true;
            this.$store.dispatch(`session/${SESSION_REQUEST_TOKEN_MAIL}`, event.target.elements.email.value) // using form data, not v-model
                .then(() => {
                    this.$data.showNextSteps = true;
                }).finally(() => {
                    this.$data.loading = false;
                });
        },
        loginWithToken(event) {
            try {
                this.$store.dispatch(`session/${SESSION_LOGIN_WITH_TOKEN}`, event.target.elements.token.value);
                this.$store.dispatch(HIDE_AUTHENTICATE_MODAL);
            } catch (error) {
                this.$data.tokenError = `Login failed! (${error})`;
            }
        },
    },
};
</script>

<style scoped>
#modal {
    position:fixed;
    z-index:9998;
    top:0;
    left:0;
    padding: 3%;
    width:100%;
    height:100%;
    box-sizing: border-box;
    background: rgba(0,0,0,0.3);
}
main {
    height:100%;
    position: relative;
}
#close {
    position: absolute;
    top:0 ;
    right:0;
}
fieldset {
    width: 30%;
    min-width: 340px;
    margin: 0 auto;
}
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
