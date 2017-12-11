<template>
  <div>

    <b-field group>
      <button
        class='button is-primary mr-10'
        @click='$router.push("/aib/flights/new/")'>
          {{$t('forms.actions.new')}}
      </button>
      <button class='button is-primary'> <b-icon icon='refresh'></b-icon> </button>
    </b-field>

    <hr>

  </div>
</template>

<script>

  export default {
    name: 'Flights'
  }

</script>
