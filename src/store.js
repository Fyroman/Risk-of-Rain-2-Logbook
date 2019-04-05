import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editShit: false,
  },
  mutations: {
    toggleShit(state) {
      state.editShit = !state.editShit;
    }
  },
  actions: {}
});
