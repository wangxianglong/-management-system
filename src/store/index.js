// store index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  //Authorization:localStorage.getItem('Authorization') ? localStorage.getItem('Authorizations') : "",

  userName: window.sessionStorage.getItem('userName'),
  // token: window.sessionStorage.getItem('token'),
  router:window.sessionStorage.getItem('router'),
  agentId:window.sessionStorage.getItem('agentId')
}
const mutations = {
  // changeLogin(state,user) {
  //   state.Authorization = user.Authorization;
  //   localStorage.setItem('Authorizations',user.Authorization)
  // },

  GET_ID: (state, data) => {
    state.agentId = data
    window.sessionStorage.setItem('agentId', JSON.stringify(data))
  },
  GET_USER: (state, data) => {
    state.userName = data
    window.sessionStorage.setItem('userName', JSON.stringify(data))
  },
  GET_ROUTER:(state,data)=>{
    state.router=data
    window.sessionStorage.setItem('router',JSON.stringify(data))
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


