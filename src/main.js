import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import { useAuthStore } from './store/AuthStore'
// Add this line to import the CSS
import "vue-toastification/dist/index.css";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialize auth before mounting
const authStore = useAuthStore()

// Wait for auth to initialize before mounting
authStore.initializeAuthState().then(() => {
  app.use(router)
  app.use(Toast, {
    position: "top-right",
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: false
  })
  app.mount('#app')
})