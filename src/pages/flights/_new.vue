<template>
  <div>

    <b-tabs v-model='currentTab'>
      <b-tab-item disabled :label='`${$t("entities.route")}s`'>

        <div class="columns mt-20">
          <div class="column is-12">

            <div class='routes-wrapper'>
              <draggable
                v-model="routes"
                :options="{ animation: 300, draggable: '.message' }">
                <transition-group name='fade' tag='div'>
                  <article
                    class="message is-primary mb-20"
                    v-for='(route, routePos) in routes'
                    :key='"route"+routePos'>

                    <div class="message-header">
                      <p> {{$t('entities.route')}} {{routePos}} </p>
                      <button class="delete" aria-label="delete" @click='removeRoute(routePos)'></button>
                    </div>

                    <div class="message-body">

                      <div class="columns">

                        <div class="column is-6">
                          <div class="field">
                            <div class="control">
                              <input
                                class="input"
                                :placeholder="$t('forms.content.departure')"
                                :data-ref='`route-${routePos}-dep`'
                                :ref='"route-"+routePos'
                                v-model='route.departure_autoinput'/>
                            </div>
                          </div>
                        </div>

                        <div class="column is-4">
                          <b-field>
                            <b-datepicker
                                :placeholder="$t('forms.content.date')"
                                icon="calendar"
                                :readonly="false"
                                :month-names="$t('buefy.datepicker.months')"
                                :day-names="$t('buefy.datepicker.days_short')"
                                v-model='route.departure_date'>
                            </b-datepicker>
                          </b-field>
                        </div>

                        <div class="column is-2">
                          <b-field>
                            <b-timepicker
                                :placeholder="$t('forms.content.time')"
                                icon="clock-o"
                                :readonly="false"
                                v-model='route.departure_time'>
                            </b-timepicker>
                          </b-field>
                        </div>

                      </div>

                      <div class="columns">

                        <div class="column is-6">
                          <div class="field">
                            <div class="control">
                              <input
                                class="input"
                                :placeholder="$t('forms.content.arrival')"
                                :data-ref='`route-${routePos}-arr`'
                                :ref='"route-"+routePos'
                                v-model='route.arrival_autoinput'/>
                            </div>
                          </div>
                        </div>

                        <div class="column is-4">
                          <b-field>
                            <b-datepicker
                                :placeholder="$t('forms.content.date')"
                                icon="calendar"
                                :readonly="false"
                                :month-names="$t('buefy.datepicker.months')"
                                :day-names="$t('buefy.datepicker.days_short')"
                                v-model='route.arrival_date'>
                            </b-datepicker>
                          </b-field>
                        </div>

                        <div class="column is-2">
                          <b-field>
                            <b-timepicker
                                :placeholder="$t('forms.content.time')"
                                icon="clock-o"
                                :readonly="false"
                                v-model='route.arrival_time'>
                            </b-timepicker>
                          </b-field>
                        </div>

                        <!-- <div class="column is-4">
                          <b-field>
                            <b-select
                              :placeholder='$t("forms.select")'
                              :loading='isLoadingAirplanes'
                              :disabled='isLoadingAirplanes'
                              v-model='flight.airplaneRef'
                              expanded>
                              <optgroup v-for='airplane in airplanes' :label='airplane.companyName'>
                                <option v-for='companyAirplane in airplane.companyAirplanes'
                                        :value='companyAirplane.airplaneRef'>
                                  {{companyAirplane.name}} @ {{companyAirplane.number}}
                                </option>
                              </optgroup>
                            </b-select>
                          </b-field>
                        </div> -->

                      </div>

                    </div>
                  </article>
                </transition-group>
              </draggable>
              <button class="button is-large is-fullwidth is-ghost is-uppercase" @click='addRoute'> {{$t('forms.actions.new')}} {{$t('entities.route')}} </button>
            </div>

            <hr>

            <button
              class="button is-primary is-pulled-right"
              :disabled='routes.length < 2'
              @click='generateFlight'>
                {{$t('forms.content.generate')}} {{$t('entities.flight')}} {{$t('entities.route')}}s
            </button>

          </div>
        </div>

      </b-tab-item>

      <b-tab-item disabled :label='$t("forms.content.check")'></b-tab-item>

    </b-tabs>

  </div>
</template>

<script>

  import draggable from 'vuedraggable'

  export default {
    name: 'Flights',
    components: {
      draggable
    },
    data() {
      return {
        currentTab: 0,
        isLoadingAirplanes: false,
        flight: {
          number_id: null,
          airplaneRef: null,
          status: 'not_started',
          schedules: []
        },
        airplanes: [],
        routes: [],
        global_api: null,
        currentMap: null
      }
    },
    methods: {

      initApi() {
        this.$maps.load(maps_api => {
          this.getMapi(maps_api)
        })
      },
      async getMapi(mapi) {

        this.global_api = mapi
        await this.getAirplanes()

      },

      async getAirplanes() {

        this.isLoadingAirplanes = true

        this.$fs.collection('companys').get()
        .then(companySnapshot => {

          companySnapshot.forEach(company => {

            let currentCompany = {
              companyName: company.data().name,
              companyRef: company.ref.path,
              companyAirplanes: []
            }

            this.$fs.collection('airplanes').where("companyRef", "==", company.ref.path).get()
            .then(companyAirplanesSnapshot => {

              if(companyAirplanesSnapshot.empty)
                return false

              companyAirplanesSnapshot.forEach(airplane => {
                currentCompany.companyAirplanes.push({
                  name: airplane.data().name,
                  number: airplane.data().number,
                  airplaneRef: airplane.data().companyRef
                })
              })

              return true

            })
            .then(res => {if(res) this.airplanes.push(currentCompany)})
            .catch(error_02 => {
              console.log('error_02 =>', error_02)
            })

          })

        })
        .then(() => this.isLoadingAirplanes = false)
        .catch(error_01 => {
          console.log('error_01 =>', error_01)
        })

      },

      addRoute() {

        this.routes.push({
          departure_autoinput: (this.routes.length > 0) ? this.routes[this.routes.length-1]['arrival_autoinput'] : '',
          arrival_autoinput: '',
          //
          departure_place_id: (this.routes.length > 0) ? this.routes[this.routes.length-1]['arrival_place_id'] : '',
          departure_date: new Date(),
          departure_time: new Date(),
          //
          arrival_place_id: null,
          arrival_date: new Date(),
          arrival_time: new Date()
        })

        // get last index (not the size) of this.routes
        this.getInput(this.routes.length-1)

      },
      getInput(inputIndex) {

        // dep

        let inputDep = this.$$(`[data-ref="route-${inputIndex}-dep"]`)

        if(inputDep.length === 0) {

          document.arrive(`[data-ref="route-${inputIndex}-dep"]`, (eventInput) => {
            this.$das(eventInput)
            this.addAutoComplete(eventInput, inputIndex, 'dep')
          })

          this.$lodash.delay(() => {
            document.unbindArrive(`[data-ref="route-${inputIndex}-dep"]`)
          }, 1000 * 60) // unbind waiting for arrive after one minute

        } else {
          inputDep = inputDep[0]
          this.$das(inputDep)
          this.addAutoComplete(inputDep, inputIndex, 'dep')
        }

        // arr

        let inputArr = this.$$(`[data-ref="route-${inputIndex}-arr"]`)

        if(inputArr.length === 0) {

          document.arrive(`[data-ref="route-${inputIndex}-arr"]`, (eventInput) => {
            this.$das(eventInput)
            this.addAutoComplete(eventInput, inputIndex, 'arr')
          })

          this.$lodash.delay(() => {
            document.unbindArrive(`[data-ref="route-${inputIndex}-arr"]`)
          }, 1000 * 60) // unbind waiting for arrive after one minute

        } else {
          inputArr = inputArr[0]
          this.$das(inputArr)
          this.addAutoComplete(inputArr, inputIndex, 'arr')
        }

      },
      addAutoComplete(input, inputIndex, type) {

        let getType = (type === 'dep') ? 'departure_place_id' : 'arrival_place_id'
        let inputModel = (type === 'dep') ? 'departure_autoinput' : 'arrival_autoinput'

        let autocomplete_input = new this.global_api.maps.places.Autocomplete(
          input,
          new this.global_api.maps.LatLngBounds(
            new this.global_api.maps.LatLng(-90,-180),
            new this.global_api.maps.LatLng(90,180)
          )
        ).addListener('place_changed', () => {

          let place = autocomplete_input.f.getPlace()

          if(!place.geometry) {

            this.$toast.open({
              type: 'is-warning',
              message: `${this.$t('messages.maps.no_place_details')}.`
            })

            return false

          } else {

            this.routes[inputIndex][inputModel] = input.value
            this.routes[inputIndex][getType] = place.place_id

          }

        })

      },
      removeRoute(index) {
        this.routes.splice(index, 1)
      },

      generateFlight() {
        this.currentTab = 1
      },

      createMap(element, data) {

        console.log(data)

        let map = new this.global_api.maps.Map(element, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeId: this.global_api.maps.MapTypeId.HYBRID,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: this.global_api.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'terrain', 'hybrid', 'satellite']
          },
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        })

        // infoWindow: new vm.global_api.maps.InfoWindow({
        //   content: `<div> <strong> ${place.name} </strong> <br> ${place.formatted_address} </div>`
        // }),
        // mark: new vm.global_api.maps.Marker({
        //   map: vm.currentMap,
        //   draggable: false,
        //   animation: vm.global_api.maps.Animation.DROP,
        //   position: place.geometry.location,
        //   title: place.name
        // }).addListener('click', function() {
        //   vm.schedules[index].infoWindow.open(vm.currentMap, this)
        // })

        // if(place.geometry.viewport) {
        //   vm.mapBounds.union(place.geometry.viewport)
        // } else {
        //   vm.mapBounds.extend(place.geometry.location)
        // }

        // vm.currentMap.fitBounds(vm.mapBounds)

      }

    },
    mounted() {

      this.initApi()

    }
  }

</script>

<style lang='sass'>

  .routes-wrapper
    overflow-y: scroll

</style>
