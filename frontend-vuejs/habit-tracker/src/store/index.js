import Vue from 'vue'
import Vuex from 'vuex'
import resource from '../http'
import * as storage from '../http/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: ''
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    ActionSetUser(context, payload) {
      context.commit('setUser', payload);
    },
    ActionSetToken(context, payload) {
      storage.setHeaderToken(payload);
      storage.setLocalToken(payload);
      context.commit('setToken', payload);
    },
    ActionCheckToken({ dispatch, state }) {
      if (state.token) {
        return Promise.resolve(state.token)
      }

      const storageToken = storage.getLocalToken();

      if (!storageToken) {
        return Promise.reject(new Error('Invalid Token'));
      }
      
      dispatch('ActionSetToken', storageToken);      
    },
    ActionDoLogin({ dispatch }, payload) {
      return resource.login(payload).then(res => {
        dispatch('ActionSetUser', res.body.user)
        dispatch('ActionSetToken', res.body.token)
      })
    },
    ActionRegister({ dispatch }, payload) {
      return resource.register(payload).then(res => {
        dispatch('ActionSetUser', res.body.user)
        dispatch('ActionSetToken', res.body.token)
      })
    },
    ActionSignOut({ dispatch }) {
      storage.setHeaderToken('');
      storage.deleteLocalToken();
      dispatch('ActionSetUser', {});
      dispatch('ActionSetUser', '');      
    }
  }
})
