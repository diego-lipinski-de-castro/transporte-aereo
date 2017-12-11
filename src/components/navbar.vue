<template>
  <nav class="navbar is-primary" role='navigation'>

    <div class="navbar-brand">

      <router-link class='navbar-item' to='/aib/dashboard/'> AIB </router-link>

      <button :class='["button navbar-burger is-primary", {"is-active": isOpen}]' @click='toggleNav'>
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>

    <div :class='["navbar-menu", {"is-active": isOpen}]'>

      <div class="navbar-start">

      </div>

      <div class="navbar-end">
        <router-link class='navbar-item' to='/aib/flights/dashboard/'> {{$t('pages.title.flights')}} </router-link>
        <router-link class='navbar-item' to='/aib/company/'> {{$t('pages.title.companys')}} </router-link>
      </div>

    </div>

  </nav>
</template>

<script>

  export default {
    name: 'navbar',
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggleNav() {
        this.isOpen = !this.isOpen
      }
    },
    mounted() {

      Array.from(this.$$('.navbar-menu')[0].children).map(menu => {
        Array.from(menu.children).map(menuItem => {
          if(this.isTouch)  menuItem.onclick = () => this.$lodash.delay(() => this.isOpen = false, 500)
        })
      })

    }
  }

</script>
