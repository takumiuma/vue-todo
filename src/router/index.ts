import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todoView',

      component: () => import('../views/todoView.vue'),
    },
    {
      path: '/todo-use-api',
      name: 'todo-use-api',
      component: () => import('../views/todoUseAPI.vue'),
    },
    {
      path: '/composition',
      name: 'composition',
      component: () => import('../views/compositionView.vue'),
    },
    {
      path: '/composition-use-api',
      name: 'composition-use-api',
      component: () => import('../views/compositionUseAPI.vue'),
    },
  ],
})

export default router
