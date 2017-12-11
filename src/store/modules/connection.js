import * as types from './../mutation-types'

const state = {
  online: true
}

const mutations = {
  [types.SET_CONN] (state, conn) {
    state.online = conn
  }
}

const actions = {
  setConn ({ commit }, conn) {
    commit(types.SET_CONN, conn)
  }
}

const getters = {
  getConn: state => state.online,
  getConnFn: state => () => state.online
}

export default {
  state,
  mutations,
  actions,
  getters
}
