<template>
  <section class='hero is-primary is-fullheight is-bold'>
    <div class='hero-body'>
      <div class='container has-text-centered'>
        <h1 class='title'>
          {{$t('title')}}
        </h1>
        <hr>
        <router-link class='button is-white has-text-primary is-flex-mobile' to='/aib/flights/dashboard'>
          {{$t('go')}}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>

  export default {
    name: 'Login'
  }

</script>
