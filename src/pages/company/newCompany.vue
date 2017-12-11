<template>
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title"> {{$t('forms.actions.new')}} {{$t('entities.company')}} </p>
    </header>

    <section class="modal-card-body">
      <b-field :label='$t("forms.content.name")'>
        <b-input
          type='text'
          v-model='company.name'>
        </b-input>
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <button class="button" @click='$parent.close()'> {{$t('forms.actions.close')}} </button>
      <button class="button is-primary" @click='saveCompany'> {{$t('forms.actions.save')}} </button>
    </footer>

  </div>
</template>

<script>

  export default {
    name: 'NewCompany',
    data() {
      return {
        company: {
          name: ''
        }
      }
    },
    methods: {
      saveCompany() {
        this.$fs.collection('companys').add({
          name: this.company.name
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
