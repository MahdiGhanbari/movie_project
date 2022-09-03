import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    genres: {}
  },
  mutations: {
    SET_GENRES(state, arr) {
      arr.forEach(({id, name}) =>  state.genres[id] = name)
    }
  },
  actions: {
  }
})
