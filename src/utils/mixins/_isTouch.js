export default {
  computed: {
    isTouch() {
      return window.matchMedia('(max-width: 1023px)').matches
    }
  }
}
