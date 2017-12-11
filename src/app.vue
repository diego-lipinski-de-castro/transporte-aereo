<template>
  <div id='app' v-cloak>

    <div class='pageloader' ref='pageloader'></div>

    <transition name='fade'>
      <detect-network v-on:detected-condition='detected'>
        <div slot='offline' class='offline-content'> {{$t('offline')}} </div>
      </detect-network>
    </transition>

    <transition name='fade' mode='out-in'>
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>

  import detectNetwork from 'v-offline'

  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'app',
    components: {
      detectNetwork
    },
    metaInfo() {
      return {
        title: this.title,
        titleTemplate: (title) => {
          return title ? `AIB - ${this.$t('pages.title.'+title)}` : 'Air Business'
        },
        htmlAttrs: {
          lang: this.getLocale
        }
      }
    },
    created() {

      this.$router.beforeEach((to, from, next) => {

        this.$refs.pageloader.classList.add('is-active')
        setTimeout(() => {
          next()
        }, 500);

      })

      this.$router.afterEach((to, from) => {

        setTimeout(() => {
          this.$refs.pageloader.classList.remove('is-active')
        }, 500)

      })

    },
    computed: {
      ...mapGetters([
        'getConn',
        'getLocale'
      ]),
      title() {
        return this.$route.meta.title || null
      }
    },
    methods: {
      ...mapActions([
        'setConn'
      ]),
      detected(e) {
        this.setConn(e)
      }
    }
  }

</script>

<style lang='sass'>
  @import './assets/style/app'
</style>
