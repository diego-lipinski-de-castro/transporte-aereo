<template>
  <div class="page-wrapper">

    <b-field group>
      <button class='button is-primary mr-10' @click='addCompany'>{{$t('forms.actions.new')}} </button>
      <button class='button is-primary' @click='fetchCompanys(true)'> <b-icon icon='refresh'></b-icon> </button>
    </b-field>

    <hr>

    <div class="tables-wrapper">
      <div class="columns">

        <template v-if="isLoading">
          <b-loading :active="true" :canCancel="true"></b-loading>
        </template>

        <template v-else>
          <div v-if='companys.length > 0' class="column is-3" v-for='company in companys'>

            <div class="pricing-table">
              <div class="pricing-plan">
                <div class="plan-header"> {{company.name}} </div>

                <div class="plan-price p-5">
                  <span class="plan-price-amount">
                    {{company.compAirplanes.length}}
                  </span>
                  /planes
                </div>

                <div class="plan-items" >

                  <template v-if='company.compAirplanes.length > 0'>

                    <b-collapse :open='false'>

                      <div class="plan-item p-5" slot='trigger'>
                        <button class="button is-fullwidth is-radiusless is-borderless">
                          <b-icon icon='hand-pointer-o'></b-icon>
                        </button>
                      </div>

                      <div class='plan-item is-flex center-all-flex' v-for='(airplane, index) in company.compAirplanes'>

                        {{index}} | {{airplane.name}} - {{airplane.number}}

                        <button class="button is-light ml-10" @click='deleteAirplane(airplane)'>
                          <b-icon icon='trash'></b-icon>
                        </button>

                      </div>

                    </b-collapse>

                  </template>

                  <template v-else>

                    <div class="plan-item">
                      <div class="content has-text-centered"> {{$t('forms.content.no_data')}} </div>
                    </div>

                  </template>

                </div>

                <div class="plan-footer">

                  <button class="button is-danger is-fullwidth mt-5" @click='deleteCompany(company)'>
                    <b-icon icon='trash'></b-icon>
                    <span> {{$t('forms.actions.delete')}}  </span>
                  </button>

                  <button class="button is-primary is-fullwidth mt-5" @click='addAirplane(company)'>
                    <b-icon icon='plus'></b-icon>
                    <span> {{$t('entities.airplane')}} </span>
                  </button>

                </div>
              </div>
            </div>

          </div>

          <div v-else>
            <div class="content has-text-centered"> {{$t('forms.content.no_data')}} </div>
          </div>

        </template>

      </div>
    </div>

    <hr>

    <b-modal :active.sync='isModalOpen' has-modal-card scroll='keep'>
      <new-company></new-company>
    </b-modal>

    <b-modal :active.sync='isModalOpenAirplane' has-modal-card scroll='keep'>
      <new-airplane v-bind:companyTo='companyTo'></new-airplane>
    </b-modal>

  </div>
</template>

<script>

  import NewCompanyModal from './newCompany'
  import NewAirplaneModal from './newAirplane'

  export default {
    name: 'Company',
    components: {
      'new-company': NewCompanyModal,
      'new-airplane': NewAirplaneModal
    },
    data() {
      return {
        companyTo: {},
        isEmpty: false,
        isLoading: false,
        isModalOpen: false,
        isModalOpenAirplane: false,
        companys: [],
        query: {
          per_page: 10,
          last_query: {
            per_page: 0
          }
        }
      }
    },
    computed: {
      hasCompanys() {
        return this.companys.length > 0
      }
    },
    methods: {
      addCompany() {
        this.isModalOpen = true
      },
      addAirplane(company) {
        this.companyTo = company
        this.isModalOpenAirplane = true
      },
      fetchCompanys(force) {

        if(this.query.per_page <= this.query.last_query.per_page && !force) {
          return
        }

        this.isLoading = true
        this.companys = []

        this.query.last_query.per_page = this.query.per_page

        this.$fs.collection('companys').limit(this.query.last_query.per_page).get()
        .then(compDocs => {

          compDocs.forEach(compDoc => {

            let company = {
              id: compDoc.id,
              name: compDoc.data().name,
              ref: compDoc.ref.path,
              compAirplanes: []
            }

            this.$fs.collection('airplanes')
            .where('companyRef', '==', compDoc.ref.path).orderBy('number').get()
            .then(planeQuery => {

              if(planeQuery.empty) return false

              planeQuery.forEach(plane => {
                company.compAirplanes.push({
                  // id: plane.id,
                  name: plane.data().name,
                  number: plane.data().number,
                  ref: plane.ref.path
                })
              })

              return true

            })
            .then(res => this.companys.push(company))
            .catch(error_02 => {
              console.log(error_02)
            })

          })

        })
        .then(() => this.isLoading = false)
        .catch(error_01 => {
          this.isLoading = false
          console.log(error_01)
        })

      },
      deleteCompany(companyDoc) {

        this.isLoading = true

        this.$fs.collection('airplanes').where('companyRef', '==', companyDoc.ref).get()
        .then(planeQuery => {

          if(!planeQuery.empty) {
            planeQuery.forEach(plane => {
              this.$fs.collection('airplanes').doc(plane.id).delete()
            })
          }

        })
        .then(() => {

          this.$fs.collection('companys').doc(companyDoc.id).delete()
          .then(() => {
            this.$toast.open({
              type: 'is-success',
              message: `${this.$t('messages.success')}!`
            })
          })
          .then(() => this.fetchCompanys(true))
          .then(() => this.isLoading = false)
          .catch(error_02 => {
            this.$toast.open({
              type: 'is-danger',
              message: `${this.$t('messages.failed')}!`
            })
            console.log(error_02)
          })
        })
        .catch(error_01 => {
          this.isLoading = false
          console.log(error_01)
        })
      },
      deleteAirplane(airplaneDoc) {

        this.isLoading = true

        this.$fs.doc(airplaneDoc.ref).delete()
        .then(() => {
         this.$toast.open({
            type: 'is-success',
            message: `${this.$t('messages.success')}!`
          })
        })
        .then(() => this.fetchCompanys(true))
        .then(() => this.isLoading = false)
        .catch(error => {
          this.$toast.open({
            type: 'is-danger',
            message: `${this.$t('messages.failed')}!`
          })
          this.isLoading = false
          console.log(error)
        })

      }
    },
    mounted() {
      this.fetchCompanys(true)
    }
  }

</script>
