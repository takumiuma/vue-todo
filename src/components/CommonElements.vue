<template>
  <v-app>
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
          <p>{{ item.title }}</p>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      title: 'VuetifyでTODOリスト',
      drawer: false,
      group: null,
      items: [
        { title: 'Todo(API無,OptionsAPI)', icon: 'mdi-checkbox-marked-outline', link: '/' },
        {
          title: 'Todo(API有,OptionsAPI)',
          icon: 'mdi-checkbox-multiple-marked-outline',
          link: '/todo-use-api',
        },
        { title: 'Todo(API無,CompositionAPI', icon: 'mdi-checkbox-marked', link: '/composition' },
        {
          title: 'Todo(API有,CompositionAPI',
          icon: 'mdi-checkbox-multiple-marked',
          link: '/composition-use-api',
        },
      ],
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>
