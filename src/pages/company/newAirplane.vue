<template>

  <div class="modal-card">

    <!-- {{companyTo}} -->

    <header class="modal-card-head">
      <p class="modal-card-title"> {{$t('forms.actions.new')}} {{$t('entities.airplane')}} </p>
    </header>

    <section class="modal-card-body">

      <b-field :label='$t("forms.content.name")'>
        <b-input
          type='text'
          v-model='airplane.name'>
        </b-input>
      </b-field>

      <b-field :label='$t("forms.content.number")'>
        <b-input
          type='text'
          v-model='airplane.number'>
        </b-input>
      </b-field>

    </section>

    <footer class="modal-card-foot">
      <button class="button" @click='$parent.close()'> {{$t('forms.actions.close')}} </button>
      <button class="button is-primary" @click='saveAirplane'> {{$t('forms.actions.save')}} </button>
    </footer>

  </div>

</template>

<script>

  export default {
    name: 'NewAirplane',
    props: {
      companyTo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        airplane: {
          name: '',
          number: ''
        }
      }
    },
    methods: {
      saveAirplane() {

        this.$fs.collection('airplanes').add({
          name: this.airplane.name,
          number : this.airplane.number,
          companyRef: this.companyTo.ref
        })
        .then(res => {
          console.log(res)
          this.$toast.open({
            type: 'is-success',
            message: `${this.$t('messages.success')}!`
          })
          this.$parent.close()
        })
        .catch(err => {
          console.log(err)
          this.$toast.open({
            type: 'is-danger',
            message: `${this.$t('messages.failed')}!`
          })
        })

      }
    }
  }

</script>
