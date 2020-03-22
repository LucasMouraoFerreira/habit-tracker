import Vue from 'vue'
import Vuex from 'vuex'
import resource from '../http'

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
    ActionSetUser(context, payload){
      context.commit('setUser', payload);
    },
    ActionSetToke(context, payload){
      context.commit('setToken', payload);
    },
    ActionDoLogin(context, payload){
      return resource.login(payload)
    }
  }
})
