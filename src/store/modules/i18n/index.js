import * as types from './../../mutation-types'

const state = {
  locale: 'pt-br',
  messages: {}
}

const mutations = {
  [types.SET_LOCALE] (state, {locale, localeJson}) {
    state.locale = locale
    state.messages = localeJson
  }
}

const actions = {
  async setLocale ({ commit }, locale) {

    try {

      let localeJson =  await import(`./locales/${locale}.json`)
      commit(types.SET_LOCALE, {locale, localeJson})

      return {
        success: true,
        locale: locale,
        data: localeJson
      }

    } catch(error) {
      return {
        success: false,
        data: error
      }
    }

  }
}

const getters = {
  getLocale: state => state.locale,
  getLocaleFn: state => () => state.locale
}

export default {
  state,
  mutations,
  actions,
  getters
}
