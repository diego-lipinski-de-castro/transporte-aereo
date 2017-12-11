<template>
  <section class='hero is-primary is-fullheight is-bold'>
    <div class='hero-body'>
      <div class='container has-text-centered'>
        <h1 class='title'>
          {{$t('notfound')}}
        </h1>
        <hr>
        <button class='button is-white has-text-primary is-flex-mobile' @click='goBack'>
          {{$t('back')}}
        </button>
      </div>
    </div>
  </section>
</template>

<script>

  export default {
    name: 'Notfound404',
    meta: {
      title: '404'
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }

</script>
