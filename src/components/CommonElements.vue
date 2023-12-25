<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title><v-icon icon="$vuetify"></v-icon>{{ title }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer permanent v-model="drawer">
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" :to="item.link">
        <v-icon>{{ item.icon }}</v-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main></v-main>
</template>
<script>
export default {
  data() {
    return {
      title: 'VuetifyでTODOリスト',
      drawer: false,
      group: null,
      items: [
        { title: 'Home', icon: 'mdi-home', link: '/home' },
        { title: 'About', icon: 'mdi-information', link: '/about' },
        { title: 'Todo', icon: 'mdi-clipboard-text', link: '/' }
      ]
    }
  },
  watch: {
    group() {
      this.drawer = false
    }
  }
}
</script>
