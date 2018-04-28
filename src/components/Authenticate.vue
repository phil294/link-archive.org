<template>
    <main> <!-- todo ? -->
        <button type="button" @click="HIDE_AUTHENTICATE_MODAL">
            <i class="material-icons">close</i>
        </button>
        <h1>Log in or create account</h1>
        <div id="register-or-login">
            <fieldset id="with-email">
                <legend>With e-mail</legend>
                <form v-if="!showNextSteps" @submit.prevent="requestMail($event)">
                    <label for="email">E-mail</label>
                    <input id="email" v-model="email" type="email" name="email" placeholder="email@example.com" required>
                    <button :disabled="loading" type="submit">Request mail to log in</button>
                </form>
                <div v-else class="padding-l">
                    <div>
                        An e-mail has been sent to <em>{{ email }}</em>. You can log in by clicking the link in the e-mail.
                    </div>
                    <br>
                    <a @click="showNextSteps=false">
                        Send another mail
                    </a>
                </div>
            </fieldset>
        </div>
    </main>
</template>

<script>
import { mapActions } from 'vuex';
import { HIDE_AUTHENTICATE_MODAL, SESSION_REQUEST_TOKEN_MAIL } from '@/store/actions';
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
    }),
    methods: {
        ...mapActions([
            HIDE_AUTHENTICATE_MODAL,
        ]),
        requestMail(event) {
            this.$data.loading = true;
            this.$store.dispatch(`session/${SESSION_REQUEST_TOKEN_MAIL}`,
                event.target.elements.email.value) // using form data, not v-model
                .then(() => {
                    this.$data.showNextSteps = true;
                }).finally(() => {
                    this.$data.loading = false;
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
</style>
