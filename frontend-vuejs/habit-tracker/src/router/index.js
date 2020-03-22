import Vue from 'vue'
import VueRouter from 'vue-router'
import beforeEach from './beforeEach'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),     
    },
    {
      path: '/Habits',
      name: 'Habits',
      component: () => import('../views/Habits.vue'),     
    }
  ]
})

router.beforeEach(beforeEach)

export default router


