<template>
  <div>

    <aib-navbar></aib-navbar>

      <header class='pt-50 pb-25 pl-40 pr-40'>
        <h1 class='title'> {{$t(`pages.title.${title}`)}} </h1>
        <h2 class='subtitle is-5' v-if='action'> - {{$t(`pages.action.${action}`)}} </h2>
      </header>

      <hr class='ml-40 mr-40'>

      <div class="view-wrapper">
        <transition name='fade' mode='out-in'>
          <router-view></router-view>
        </transition>
      </div>

  </div>
</template>

<script>

  import { navbar } from './../components/'

  export default {
    name: 'Admin',
    components: {
      'aib-navbar': navbar
    },
    computed: {
      title() {
        return this.$route.meta.title
      },
      action() {
        return this.$route.meta.action || false
      }
    }
  }

</script>
