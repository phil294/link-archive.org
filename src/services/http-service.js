import axios from 'axios';
import store from '@/store/root-store';

const instance = axios.create({
    baseURL: process.env.API_ROOT,
});
instance.interceptors.request.use((config) => {
    /* eslint-disable-next-line no-param-reassign */
    config.headers.common.token = store.state.session.token; // todo computed or the like?
    return config;
});
export default instance;
