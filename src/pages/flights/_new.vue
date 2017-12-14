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
                                :date-formatter="(date) => date.toLocaleDateString('pt-BR')"
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
                                :date-formatter="(date) => date.toLocaleDateString('pt-BR')"
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
              :disabled='routes.length < 1'
              @click='currentTab = 1'>
                {{$t('forms.content.generate')}} {{$t('entities.flight')}} {{$t('entities.route')}}s
            </button>

          </div>
        </div>

      </b-tab-item>

      <b-tab-item disabled :label='$t("forms.content.check")'>

        <div class="timeline-wrapper mt-20 p-20">

          <div class="timeline is-centered">

            <template v-for='(route, routesPos) in routes'>

              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">

                  <p> {{ route.departure_autoinput }} </p>

                  <p class="heading">
                    {{$fns.format(route.departure_date, 'DD/MM')}} {{$fns.format(route.departure_time, 'HH:mm')}}
                  </p>

                </div>
              </div>

              <header class="timeline-header">
                <span class="tag is-medium is-primary">
                  {{ $fns.distanceInWordsStrict(
              `${$fns.format(route.departure_date, 'MM/DD/YYYY')} ${$fns.format(route.departure_time, 'HH:mm')}`,
              `${$fns.format(route.arrival_date, 'MM/DD/YYYY')} ${$fns.format(route.arrival_time, 'HH:mm')}`,
              true
                  )}}
                </span>
              </header>

              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">

                  <p> {{ route.arrival_autoinput }} </p>

                  <p class="heading">
                    {{$fns.format(route.arrival_date, 'DD/MM')}} {{$fns.format(route.arrival_time, 'HH:mm')}}
                  </p>

                </div>
              </div>

              <div v-if='routes[routesPos+1] !== undefined' class="timeline-item">
                <div class="timeline-marker is-warning"></div>
                <div class="timeline-content">
                  {{ $fns.distanceInWords(
                    `${$fns.format(route.arrival_date, 'MM/DD/YYYY')} ${$fns.format(route.arrival_time, 'HH:mm')}`,
                    `${$fns.format(routes[routesPos+1].departure_date, 'MM/DD/YYYY')} ${$fns.format(routes[routesPos+1].departure_time, 'HH:mm')}`,
                     true, true) }}
                </div>
              </div>

            </template>

          </div>

        </div>

        <hr>

        <button
          class="button is-primary"
          @click='currentTab = 0'>
            {{$t('back')}}
        </button>

        <button
          class="button is-primary is-pulled-right"
          @click='currentTab = 3'>
            {{$t('forms.actions.confirm')}}
        </button>

        <button
          class="button is-info is-pulled-right mr-10"
          @click='generateMap'>
            {{$t('forms.content.generate')}} {{$t('forms.content.map')}}
        </button>

      </b-tab-item>

      <b-tab-item disabled :label='$t("forms.content.map")'>

        <div class="columns">
          <div class="column is-10 is-offset-1">
            <div ref='google_maps' class="google-maps-wrapper mt-20"></div>
          </div>
        </div>

        <hr>

        <button
          class="button is-primary"
          @click='currentTab = 1'>
            {{$t('back')}}
        </button>

        <button
          class="button is-primary"
          @click='currentTab = 0'>
            {{$t('entities.route')}}s
        </button>

        <button
          class="button is-primary is-pulled-right"
          @click='currentTab = 3'>
            {{$t('forms.actions.next')}}
        </button>

      </b-tab-item>

      <b-tab-item disabled :label='$t("forms.actions.finish")'>

        <div class="columns mt-20">
          <div class="column is-12">
            <b-field :label='$t("forms.content.number")'>
              <b-input
              v-model='flight.number_id'
              maxlength='80'
              has-counter
              :disabled='isCheckingNumber'
              :loading='isCheckingNumber'
              ></b-input>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column is-12">
            <b-field>
              <b-select
                :placeholder='$t("forms.content.select")'
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
          </div>
        </div>

        <hr>

        <button
          class="button is-primary"
          @click='currentTab = 2'>
            {{$t('back')}}
        </button>

        <button
          class="button is-primary"
          @click='currentTab = 0'>
            {{$t('entities.route')}}s
        </button>

        <button
          class="button is-primary"
          @click='currentTab = 1'>
            {{$t('forms.content.check')}}
        </button>

        <button
          class="button is-primary is-pulled-right"
          :disabled='saveable'>
            {{$t('forms.actions.save')}}
        </button>

      </b-tab-item>

    </b-tabs>

    <b-loading :active.sync="isLoading"></b-loading>

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
        isLoading: false,
        isLoadingAirplanes: false,
        // flight number checking
        isCheckingNumber: false,
        isNumberUsable: false,
        // flight
        flight: {
          number_id: '',
          airplaneRef: '',
          status: 'not_started',
          schedules: []
        },
        airplanes: [],
        routes: [],
        global_api: null,
        currentMap: null,
        mapBounds: null
      }
    },
    computed: {
      saveable() {
        return this.flight.number_id.length > 2 && this.flight.airplaneRef.length > 0
      }
    },
    watch: {
      'flight.number_id': _.debounce(() => {

        if(this.flight.number_id.length < 3)
          return false

        // TODO

        this.isCheckingNumber = true

        this.$fs.collection('flights').where("number_id", "==", this.flight.number_id).get()
        .then(res => {

          console.log(res)
          this.isCheckingNumber = false

        })
        .catch(error => {

          console.log(error)

          this.$toast.open({
            type: 'is-danger',
            message: `${this.$t('messages.failed')}!`
          })

          this.isNumberUsable = false
          this.isCheckingNumber = false

        })

      }, 800)
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
              this.$toast.open({
                type: 'is-danger',
                message: `${this.$t('messages.failed')}!`
              })
            })

          })

        })
        .then(() => this.isLoadingAirplanes = false)
        .catch(error_01 => {
          console.log('error_01 =>', error_01)
          this.$toast.open({
            type: 'is-danger',
            message: `${this.$t('messages.failed')}!`
          })
        })

      },

      addRoute() {

        this.routes.push({
          departure_autoinput: (this.routes.length > 0) ? this.routes[this.routes.length-1]['arrival_autoinput'] : '',
          arrival_autoinput: '',
          //
          departure_place_id: (this.routes.length > 0) ? this.routes[this.routes.length-1]['arrival_place_id'] : null,
          departure_geo: '',
          departure_date: new Date(),
          departure_time: new Date(),
          //
          arrival_place_id: null,
          arrival_geo: '',
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
        let typeGeo = (type === 'dep') ? 'departure_geo' : 'arrival_geo'

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
            this.routes[inputIndex][typeGeo] = place.geometry

          }

        })

      },
      removeRoute(index) {
        this.routes.splice(index, 1)
      },

      insertRoutes: function*() {

        yield* this.routes.map(route => {

          return this.$fs.collection('routes').add({
            route: {
              departure_place_id: route.departure_place_id,
              arrival_place_id: route.arrival_place_id
            }
          })
          .then(doc => {
            return {
              route_ref: doc.path,
              departure_datetime: `${this.$fns.format(route.departure_date, 'DD/MM/YYYY')} ^ ${this.$fns.format(route.departure_time, 'HH:mm')}`,
              arrival_datetime: `${this.$fns.format(route.arrival_date, 'DD/MM/YYYY')} ^ ${this.$fns.format(route.arrival_time, 'HH:mm')}`
            }
          })
          .catch(error => {
            console.log(error)
            return null
            this.currentTab = 0
            this.isLoading = false
          })
        })

      },

      saveFlight() {

        this.isLoading = true

        this.routes.forEach(() =>
          this.flight.schedules.push(
            Promise.resolve(this.insertRoutes().next().value)
            .then(schedule => {return schedule})))

        this.$fs.collection('flights').add(this.flight)
        .then(flight_doc => {

          this.$toast.open({
            type: 'is-success',
            message: `${this.$t('messages.success')}!`
          })

          this.isLoading = false

        })
        .catch(error => {

          console.log(error)

          this.$toast.open({
            type: 'is-danger',
            message: `${this.$t('messages.failed')}!`
          })

          this.isLoading = false

        })

      },

      generateMap() {

        this.isLoading = true
        this.currentTab = 2

        this.$lodash.delay(() => this.createMap(this.$refs.google_maps, this.routes), 500)

        this.$lodash.delay(() => this.isLoading = false, 500)

      },

      createMap(element, data) {

        let vm = this

        vm.currentMap = new vm.global_api.maps.Map(element, {
          center: new vm.global_api.maps.LatLng(0, 0),
          zoom: 2,
          mapTypeId: vm.global_api.maps.MapTypeId.HYBRID,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: vm.global_api.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'terrain', 'hybrid', 'satellite']
          },
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        })

        this.$lodash.delay(() => {
          vm.global_api.maps.event.trigger(vm.currentMap, 'resize')
        }, 300)

        this.$lodash.delay(() => {

          vm.mapBounds = new vm.global_api.maps.LatLngBounds()

          data.forEach((route, routePos) => {

            let currentData = null

            if(routePos === 0) {

              currentData = {
                formatted_address: route['departure_autoinput'],
                geometry: route['departure_geo']
              }

            } else {

              currentData = {
                formatted_address: route['arrival_autoinput'],
                geometry: route['arrival_geo']
              }

            }

            route['infoWindow'] = new vm.global_api.maps.InfoWindow({
              content: `<div> <strong> ${currentData.formatted_address} </strong> </div>`
            }),
            route['mark'] = new vm.global_api.maps.Marker({
              map: vm.currentMap,
              draggable: false,
              animation: vm.global_api.maps.Animation.DROP,
              position: currentData.geometry.location,
              title: currentData.formatted_address
            }).addListener('click', function() {
              route.infoWindow.open(vm.currentMap, this)
            })

            if(currentData.geometry.viewport) {
              vm.mapBounds.union(currentData.geometry.viewport)
            } else {
              vm.mapBounds.extend(currentData.geometry.location)
            }

            // vm.currentMap.fitBounds(vm.mapBounds)
            // vm.currentMap.panTo(vm.mapBounds)
            // vm.currentMap.panToBounds(vm.mapBounds)
            // vm.currentMap.setCenter(vm.mapBounds)

          })

        }, 700)

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

  .google-maps-wrapper
    width: 100%
    height: 100%
    max-height: 500px

</style>
