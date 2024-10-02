import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import CaseCategory from '../views/CaseCategory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/case/:category',
      name: 'caseCategory',
      component: CaseCategory,
      props: true
    }
  ]
})

export default router