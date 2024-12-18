import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/AuthStore'

// Public Views
import LandingPage from '../views/LandingPage.vue'
import CaseCategory from '../views/CaseCategory.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import NotFoundView from '../views/error/NotFoundView.vue'
import MyOrder from '../views/MyOrder.vue'
import CartView from '../views/CartView.vue'

// Layout
import AdminLayout from '../layouts/AdminLayout.vue'

// Admin Views
import DashboardView from '../views/admin/DashboardView.vue'
import CasingView from '../views/admin/CasingView.vue'
import ThemeView from '../views/admin/ThemeView.vue'
import OrderView from '../views/admin/OrderView.vue'

const adminGuard = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Pastikan hanya admin yang bisa akses
  if (!authStore.isLoggedIn || !authStore.currentUser?.isAdmin) {
    next({ name: 'notFound' })
    return
  }

  next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LandingPage
    },
    {
      path: '/orders',
      name: 'Orders',
      component: MyOrder
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView
    },
    {
      path: '/case/:category',
      name: 'caseCategory',
      component: CaseCategory,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        // Cegah SEMUA pengguna yang sudah login mengakses halaman login
        if (authStore.isLoggedIn) {
          next({ name: 'Home' })
          return
        }
        next()
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        // Cegah SEMUA pengguna yang sudah login mengakses halaman register
        if (authStore.isLoggedIn) {
          next({ name: 'Home' })
          return
        }
        next()
      }
    },

    // Admin routes 
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: adminGuard,
      children: [
        {
          path: '',
          name: 'DashboardAdmin',
          component: DashboardView,
          meta: { requiresAdmin: true }
        },
        {
          path: 'order',
          name: 'OrderCasing',
          component: OrderView,
          meta: { requiresAdmin: true }
        },
        {
          path: 'casing',
          name: 'CasingView',
          component: CasingView,
          meta: { requiresAdmin: true }
        },
        {
          path: 'theme',
          name: 'ThemeView',
          component: ThemeView,
          meta: { requiresAdmin: true }
        }
      ]
    },

    // Wildcard route untuk 404
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    if (authStore.currentUser?.isAdmin) {
      next({ name: 'DashboardAdmin' })
    } else {
      next({ name: 'Home' })
    }
    return
  }

  // Check admin routes
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!authStore.isLoggedIn || !authStore.currentUser?.isAdmin) {
      next({ name: 'notFound' })
      return
    }
  }

  next()
})

export default router