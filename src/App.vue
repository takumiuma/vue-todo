<template>
  <v-app>
    <div id="app">
      <CommonElements />
      <router-view />
    </div>
  </v-app>
</template>

<script>
import CommonElements from './components/CommonElements.vue'
export default {
  components: {
    CommonElements
  }
}
</script>
