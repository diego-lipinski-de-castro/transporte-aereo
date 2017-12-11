import Vue from 'vue'
import Vuex from 'vuex'

import i18n from './modules/i18n/'
import conn from './modules/connection'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
    i18n,
    conn
  },
  plugins: []
})

export default store
