import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    a: 1,
    revItems: [],
  },
  getters: {},
  mutations: {
    setRevItems(state, payload) {
      state.revItems = payload;
    },
    removeRevItem(state, index) {
      state.revItems.splice(index, 1);
    }
  },
  actions: {},
  modules: {}
})
