// store index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  userName: window.sessionStorage.getItem('userName'),
  token: window.sessionStorage.getItem('token')
}
const mutations = {
  SET_TOKEN: (state, data) => {
    state.token = data
    window.sessionStorage.setItem('token', data) 
  },
  GET_USER: (state, data) => {
    state.userName = data
    window.sessionStorage.setItem('userName', data)
  },
  //登出
  LOGOUT: (state) => {
    state.token = null
    state.user = null
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('userName')
  }
}

const actions = {
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})

