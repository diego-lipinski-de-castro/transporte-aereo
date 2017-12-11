import Vue from 'vue'

// global vue settings
Vue.config.devtools = true
Vue.config.productionTip = true
Vue.config.silent = false
Vue.config.keyCodes = {
  // v: 86,
  // f1: 112,
  // "media-play-pause": 179,
  // up: [38, 87]
}

import store from './store'
import router from './router'

import { sync } from 'vuex-router-sync'
sync(store, router, { moduleName: 'router' })

let currentLocale = window.navigator.language.toLowerCase()

store.dispatch('setLocale', currentLocale)
.then(res => {

  if(res.success) {
    initApp(res)
  } else {
    console.log(res)
  }

})
.catch(error => {
  console.log(error)
})

import VueI18n from 'vue-i18n'
import VueMeta from 'vue-meta'
import lodash from 'lodash'
import moment from 'moment'

import arrive from 'arrive'
window.arrive = arrive

import * as mixins from './utils/mixins'

Object.keys(mixins).forEach(mixin => {
  Vue.mixin(mixins[mixin])
})

import * as utils from './utils/utils'

Vue.prototype.$das = utils['das']

import maps from 'google-maps'
maps.KEY = 'AIzaSyC7e5SYRB8rBXvchlXVbJB9lkyErcbCQDU'
maps.LIBRARIES = [
  'places'
]

import { fb_app, fs } from './firebase_config'

import Buefy from 'buefy'

import app_root from './app'

function initApp(i18nConfig) {

  // const VueI18n = require('vue-i18n')
  Vue.use(VueI18n)

  const i18n = new VueI18n({
    locale: i18nConfig.locale,
    fallbackLocale: i18nConfig.locale,
    messages: {
      [i18nConfig.locale]: i18nConfig.data
    }
  })

  maps.LANGUAGE = i18nConfig.locale
  maps.REGION = i18nConfig.locale.slice(3,5).toUpperCase()

  store.subscribe(mutation => {
    if(mutation.type === 'SET_LOCALE') {
      i18n.setLocaleMessage(mutation.payload.locale, mutation.payload.localeJson)
      i18n.locale = mutation.payload.locale
      maps.LANGUAGE = mutation.payload.locale
      maps.REGION = mutation.payload.locale.slice(3,5).toUpperCase()
    }
  })

  // const VueMeta = require('vue-meta')
  Vue.use(VueMeta, require('./config/vue-meta.json'))

  // const lodash = require('lodash')
  Vue.prototype.$lodash = lodash

  // const moment = require('moment')
  Vue.prototype.$moment = moment

  // const arrive = require('arrive')
  // Vue.prototype.$arrive

  // let EventBus = new Vue()
  // Vue.prototype.$bus = EventBus

  // firebase
  Vue.prototype.$fb = fb_app
  Vue.prototype.$fs = fs

  // google maps api
  Vue.prototype.$maps = maps

  Vue.prototype.$$ = document.querySelectorAll.bind(document)

  // const app_root = require('./app')

  Vue.use(Buefy, {
    defaultIconPack: 'fa',
    defaultDateFormatter: '',
    defaultDateParser: '',
    defaultDayNames: '',
    defaultMonthNames: ''
  })

  // vue instance app
  const app = new Vue({
    el: '#app',
    name: 'Root',
    store,
    router,
    i18n,
    render: h => h(app_root)
  })

}

export default { app, store, router }
