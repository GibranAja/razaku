import { createApp } from 'vue'
import Toast from "vue-toastification";
// Add this line to import the CSS
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// Configure toast options
app.use(Toast, {
  position: "top-right",
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: false
})

app.use(router)
app.use(pinia)

app.mount('#app')