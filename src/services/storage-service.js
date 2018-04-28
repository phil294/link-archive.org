const STORAGE_TOKEN = 'token';
const STORAGE_EMAIL = 'email';

export default {
    getToken() {
        return localStorage.getItem(STORAGE_TOKEN);
    },
    setToken(token) {
        if (token === null) {
            localStorage.removeItem(STORAGE_TOKEN);
        } else {
            localStorage.setItem(STORAGE_TOKEN, token);
        }
    },
    getEmail() {
        return localStorage.getItem(STORAGE_EMAIL);
    },
    setEmail(email) {
        if (email === null) {
            localStorage.removeItem(STORAGE_EMAIL);
        } else {
            localStorage.setItem(STORAGE_EMAIL, email);
        }
    },
};
