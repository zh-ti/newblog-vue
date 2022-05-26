import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: null,
  },
  actions: {
    setCurrentUser(context, user) {
      context.commit('setCurrentUser', user)
    },
  },
  mutations: {
    setCurrentUser(state, user) {
      this.state.currentUser = user
      // 判断 user 是否存在，如果存在将他的信息存入 Cookie，否则从 Cookie 中删除
      if (user) {
        VueCookie.set('currentUserInfo', JSON.stringify(user), user.expireTime)
      } else {
        VueCookie.delete('currentUserInfo')
      }
    },
  },
})

export default store
