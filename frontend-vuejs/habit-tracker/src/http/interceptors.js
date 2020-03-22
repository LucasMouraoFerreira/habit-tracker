import store from "../store"
import * as storage from './storage'

export default req => {

    return ({ status }) => {
        var token = store.state.token;
        if (!token) {
            token = storage.getLocalToken();
        }
        req.headers.set('Authorization', `Bearer ${token}`);
        if (status === 401) {
            store.dispatch('ActionSignOut');
            window._Vue.$router.push({ name: 'Home' });
        }
    }
}