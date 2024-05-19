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
      path: '/todo-render',
      name: 'todo-render',
      component: () => import('../views/todoRender.vue'),
    },
    {
      path: '/composition',
      name: 'composition',
      component: () => import('../views/compositionView.vue'),
    },
  ],
})

export default router
