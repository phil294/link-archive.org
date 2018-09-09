const STORAGE_TOKEN = 'token';

export default {
    getToken() {
        return localStorage.getItem(STORAGE_TOKEN);
    },
    setToken(token) {
        if (!token) {
            localStorage.removeItem(STORAGE_TOKEN);
        } else {
            localStorage.setItem(STORAGE_TOKEN, token);
        }
    },
};
