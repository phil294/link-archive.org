const STORAGE_USERNAME = 'username';
const STORAGE_EMAIL = 'email';

export default {
    getUsername() {
        return localStorage.getItem(STORAGE_USERNAME);
    },
    setUsername(username) {
        if (username === null) {
            localStorage.removeItem(STORAGE_USERNAME);
        } else {
            localStorage.setItem(STORAGE_USERNAME, username);
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
